import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell,
} from "@table-library/react-table-library/table";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable } from "@fortawesome/free-solid-svg-icons";

const tblColumnsColumns = [
  { label: "Name", renderCell: (i) => i.name },
  { label: "Type", renderCell: (i) => i.type },
  { label: "Description", renderCell: (i) => i.description },
];

function SingleTable(props) {
  const [data, setData] = useState({});

  const fetchTable = (uuid) =>
    fetch(`/api/table/${uuid}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
      });

  const [search, setSearch] = useState("");

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  let uuid = props.uuid || useParams().uuid;

  useEffect(() => {
    fetchTable(uuid);
  }, []);

  return (
    <>
      <div className="table-heading-wrap">
        <span className="table-icons">
          <FontAwesomeIcon icon={faTable} size="2xl" />
        </span>
        <h1 className="table-heading">
          <span className="database-name">{data.database_name}</span>
          <span className="table-name">{data.name}</span>
        </h1>
      </div>
      <p>{data.description || "There is no description for this table yet."}</p>
      <h2>Columns</h2>
      <div className="section-wrapper">
        <div className="table-search">
          <label htmlFor="search">
            Search:&nbsp;
            <input
              id="search"
              type="text"
              value={search}
              onChange={handleSearch}
            />
          </label>
        </div>
        <Table
          data={{
            nodes: (data.columns || []).filter((c) =>
              c.name.toLowerCase().includes(search.toLowerCase())
            ),
          }}
        >
          {(tableList) => (
            <>
              <Header>
                <HeaderRow>
                  <HeaderCell>Name</HeaderCell>
                  <HeaderCell>Type</HeaderCell>
                  <HeaderCell>Description</HeaderCell>
                </HeaderRow>
              </Header>

              <Body>
                {tableList.map((item) => (
                  <Row key={item.id} item={item}>
                    <Cell>{item.name}</Cell>
                    <Cell>{item.type}</Cell>
                    <Cell>{item.description}</Cell>
                  </Row>
                ))}
              </Body>
            </>
          )}
        </Table>
      </div>
    </>
  );
}

export default SingleTable;
