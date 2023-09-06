import SingleTable from "./single-table";
import { useEffect, useState } from "react";
import Aws_Logo from "../assets/aws.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpRightAndDownLeftFromCenter,
  faTable,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";

function Tables() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [paneState, setPaneState] = useState({ open: false });

  const fetchTables = () =>
    fetch("/api/tables")
      .then((res) => res.json())
      .then(setData);

  const handleTableClick = (uuid) => () =>
    setPaneState({ open: true, uuid: uuid }); //navigate(`/table/${uuid}`);

  const sendToSingleTable = () => navigate(`/table/${paneState.uuid}`);

  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <>
      <h1>Tables</h1>
      {data.map((table) => (
        <div
          onClick={handleTableClick(table.uuid)}
          className="table-asset"
          key={table.uuid}
        >
          <div className="badges">
            <img src={Aws_Logo} alt="AWS" />
          </div>
          <div className="table-heading-wrap">
            <span className="table-icons">
              <FontAwesomeIcon icon={faTable} size="lg" />
            </span>
            <span className="table-heading">
              <span className="database-name">{table.database_name}</span>
              <span className="table-name">{table.name}</span>
            </span>
          </div>
          <div className="table-asset-bottom-outer">
            <div className="table-asset-bottom">
              <span className="table-description">{table.description}</span>
            </div>
          </div>
        </div>
      ))}
      <SlidingPane
        width="50%"
        hideHeader={true}
        isOpen={paneState.open}
        onRequestClose={() => {
          setPaneState({ open: false });
        }}
      >
        <div className="slidingpane-links">
          <span className="slidingpane-link-close">
            <FontAwesomeIcon
              onClick={() => setPaneState({ open: false })}
              icon={faXmark}
              size="xl"
            />
          </span>
          <span className="slidingpane-link-expand">
            <FontAwesomeIcon
              onClick={() => sendToSingleTable()}
              icon={faUpRightAndDownLeftFromCenter}
              size="sm"
            />
          </span>
        </div>
        <SingleTable uuid={paneState.uuid} />
      </SlidingPane>
    </>
  );
}

export default Tables;
