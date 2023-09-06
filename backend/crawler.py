#!/usr/bin/env python

import boto3
import flatdict
import re
import json
import uuid
from botocore.config import Config
from dataclasses import dataclass
from functools import reduce

CACHE_LOC = '/data/cache.json'


# Connection models

@dataclass
class Connection:
    id: str
    name: str


@dataclass
class AWSConnection(Connection):
    region: str
    access_key_id: str
    secret_key: str


# Exceptions

class CrawlingError(Exception):
    pass


class DeserialisationError(CrawlingError):
    pass


aws_connection = AWSConnection(id='basic_aws_connection',
                               name='Basic AWS Connection',
                               region='eu-west-2',
                               access_key_id='',
                               secret_key='',
                               )


def connect_to_glue(connection: AWSConnection):
    return boto3.client('glue',
                        aws_access_key_id=connection.access_key_id,
                        aws_secret_access_key=connection.secret_key,
                        region_name=connection.region)


def serialize_table(connection, t):
    def parse_column_struct_string(s: str) -> flatdict.FlatDict:
        d = {}
        stack = []
        for match in re.finditer(r"([^:<>,]+):(?:(struct|array)<|([^:<>,]*)(>*),?)|(\w+|.)", s):
            key, opening, value, closing, invalid = match.group(1, 2, 3, 4, 5)
            if opening:
                d[key] = {}
                stack.append(d)
                d = d[key]
                continue

            if invalid:
                raise DeserialisationError(
                    f"Unable to deserialise column type: {s}; expected key:value, but found {invalid}.")

            if not value:
                raise DeserialisationError(
                    f"Unable to deserialise column type: missing value after column in {s}")

            d[key] = value
            if closing:
                if len(closing) > len(stack):
                    raise DeserialisationError(
                        f"Unable to deserialise column type: too many {closing}.")
                d = stack[-len(closing)]
                del stack[-len(closing):]

        if stack:
            raise DeserialisationError(
                f"Unable to deserialise column type: missing \">\" in {s}")
        return flatdict.FlatDict(d, delimiter='/')

    def serialize_column(acc: list[dict], c: dict) -> list[dict]:
        type_string = c['Type']
        type_string = ''.join([char.lower()
                              for char in type_string if char != ' '])
        type_string = type_string.replace('array<', 'array<[]:')
        # Slight hack: prevents additional commas confusing the deserialisation
        type_string = re.sub('\s?\(.*?\)', '', type_string)
        if type_string.startswith('struct<') or type_string.startswith('array<'):
            parsed = parse_column_struct_string(c['Name'] + ':' + type_string)
            for key, value in parsed.items():
                acc = acc + [{
                    'uuid': str(uuid.uuid5(uuid.NAMESPACE_URL, f"{connection.id}|{t['DatabaseName']}|{t['Name']}|{key}")),
                    'name': key,
                    'type': value,
                }]

            return acc

        acc.append({
            'uuid': str(uuid.uuid5(uuid.NAMESPACE_URL, f"{connection.id}|{t['DatabaseName']}|{t['Name']}|{c['Name']}")),
            'name': c['Name'],
            'type': c['Type'],
            'description': c.get('Comment', ''),
        })
        return acc

    return {
        'uuid': str(uuid.uuid5(uuid.NAMESPACE_URL, f"{connection.id}|{t['DatabaseName']}|{t['Name']}")),
        'name': t['Name'],
        'database_name': t['DatabaseName'],
        'description': t['Description'],
        'columns': reduce(lambda acc, c: acc + serialize_column([], c), table['StorageDescriptor']['Columns'], []) + reduce(lambda acc, c: acc + serialize_column([], c), table.get('PartitionKeys', []), []),
    }


glue = connect_to_glue(aws_connection)

databases = glue.get_databases()['DatabaseList']
for database in databases:
    tables = glue.get_tables(DatabaseName=database['Name'])['TableList']
    table_data = {}
    for table in tables:
        t = glue.get_table(Name=table['Name'],
                           DatabaseName=database['Name'])['Table']
        t = serialize_table(aws_connection, t)
        print(t['columns'])
        table_data.setdefault(t['uuid'], t)

    with open(CACHE_LOC, 'w') as f:
        json.dump(table_data, f)
        f.close()
