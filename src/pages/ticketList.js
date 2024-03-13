import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DataTable from 'react-data-table-component';
import axios from 'axios';
import './ticketList.css'

export default function TicketList(props) {
  const [ticketsList, setTicketsList] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  let page = 1;
  const [sortMetaData, setSortMetaData] = useState({
    sortKey: { name: 'Subject' },
    sortDirection: 'asc'
  });
  // const [mode, setMode] = useState(props.mode);
  const [filterForm, setFilterForm] = useState({
    priority: '',
    status: 'pending',
    query: '',
  })

  const paginationComponentOptions = {
    noRowsPerPage: true,
    rowsPerPageText: 'Rows per page',
    rangeSeparatorText: 'of',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
};

  const ExpandedComponent = ({ data }) => <div className='container-fluid'><p>{data.content}</p></div>;

  const handleDeleteClick = async (e) => {
    const deleteTicketUrl = `http://localhost:3001/tickets/${e.target.id}`;
    await axios.request({
      url: deleteTicketUrl,
      method: 'delete',
      headers: {
        'Content-Type': 'appplication/json',
      }
    }).then(function (response) {
      toast.success(response.data.message);
      const newTickets = tickets.filter((ticket) => {
        return ticket.id != e.target.id;
      })
      setTickets(newTickets);
    })
    .catch(function (error) {
      toast.error(error.response.data.error);
    });
  }

  let columns = []

    columns = [
      {
        name: 'Subject',
        selector: row => row.subject,
        sortable: true,
      },
      {
        name: 'Category',
        selector: row => row.category,
      },
      {
        name: 'Priority',
        selector: row => row.priority,
        sortable: true,
      },
      {
        name: 'Status',
        selector: row => row.status,
      },
      {
        name: 'Assigned To',
        selector: row => row.assigned_to,
      },
    ];

  useEffect(
    () => {
      getTickets();
    }, []
  )

  const getTickets = async () => {
    // let params = `mode=${mode}`
    let params = `page=${page}`;
    if (filterForm.query.length > 0) {
      params += `&term=${filterForm.query}`
    }
    if (filterForm.status.length > 0) {
      params += `&status=${filterForm.status}`
    }
    if (filterForm.priority.length > 0) {
      params += `&priority=${filterForm.priority}`
    }
    if (sortMetaData.sortKey && sortMetaData.sortDirection) {
      params += `&sortBy=${sortMetaData.sortKey.name}&sortDirection=${sortMetaData.sortDirection}`
    }
    setLoading(true);
    const getTicketsUrl = `http://localhost:3001/tickets?${params}`;

    await axios.request({
      url: getTicketsUrl,
      method: 'get',
      headers: {
        'Content-Type': 'appplication/json'
      }
    }).then(function (response) {
      setTickets(response.data.data);
      setTotalRows(response.data.total_count);
      setLoading(false);
      const listItems = response.data.data.map((ticket) => {
        return (
          <li key={ticket.id} className="list-group-item d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
              <div className="fw-bold">{ticket.subject}</div>
              {ticket.content}
              <div>
                <strong>Assigned To:</strong> {ticket.assigned_to}
              </div>
              <div>
                <strong>Status:</strong> {ticket.status}
              </div>
              <div>
                <strong>Priority:</strong> {ticket.priority}
              </div>
            </div>
            <span className="badge bg-primary rounded-pill">{ticket.category}</span>
          </li>
        )
      })
      setTicketsList(listItems);
    })
    .catch(function (error) {
      toast.error(error.response.data.error);
    });
  }

  function handlePageChange(p) {
    page = p;
    getTickets();
  }

  function handleSort(column, sortDirection) {
    setSortMetaData({
      sortKey: column,
      sortDirection: sortDirection
    })
    getTickets()
  }

  const deleteTicket = async (e, id) => {
    e.stopPropagation();
    const deleteTicketUrl = `http://localhost:3001/tickets/${id}`;
    await axios.request({
      url: deleteTicketUrl,
      method: 'delete',
      headers: {
        'Content-Type': 'appplication/json'
      }
    }).then(function (response) {
      toast.success(response.data.message);
    })
    .catch(function (error) {
      toast.error(error.response.data.error);
    });
	};

  function handleChange(e) {
    const { name, value } = e.target;

    setFilterForm({
      ...filterForm,
      [name]: value,
    });
  }

  function searchTickets() {
    page = 1;
    getTickets();
    setCurrentPage(1);
  }

  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select value={filterForm.status} name="status" onChange={handleChange} className="form-control" id="status">
              <option value=''></option>
              <option value='pending'>Pending</option>
              <option value='in_progress'>In Progress</option>
              <option value='resolved'>Resolved</option>
              <option value='closed'>Closed</option>
            </select>
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select value={filterForm.priority} name="priority" onChange={handleChange} className="form-control" id="priority">
              <option value=''></option>
              <option value='high'>High</option>
              <option value='low'>Low</option>
              <option value='medium'>Medium</option>
            </select>
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input value={filterForm.query} name="query" onChange={handleChange} type="text" className="form-control" id="subject" />
          </div>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-12 d-flex justify-content-end">
          <button type="button" onClick={searchTickets} className="btn btn-primary">
            Search
          </button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={tickets}
        progressPending={loading}
        // selectableRows
        expandableRows
        pagination
        paginationServer
        responsive
        paginationTotalRows={totalRows}
        onChangePage={handlePageChange}
        sortServer
        onSort={handleSort}  
        highlightOnHover
        striped
        paginationDefaultPage={currentPage}
        // selectableRowsNoSelectAll
        pointerOnHover
        // selectableRowsHighlight
        // selectableRowsRadio="checkbox"
        expandOnRowDoubleClicked
        paginationComponentOptions={paginationComponentOptions}
        expandableRowsComponent={ExpandedComponent}
      />
      {/* <ul className="list-group">
        {ticketsList}
      </ul> */}
    </div>
  )
}