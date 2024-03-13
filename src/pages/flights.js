import { useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios';
import './flightList.css'

export default function Flights() {
  const [flightsList, setFlights] = useState(null);
  const [filterForm, setFilterForm] = useState({
    source: '',
    destination: '',
    travel_date: '',
    return_date: ''
  })

  const getFlights = async () => {
    let params = '';
    if (filterForm.source?.length > 0) {
      params += `&source=${filterForm.source}`
    }
    if (filterForm.destination?.length > 0) {
      params += `&destination=${filterForm.destination}`
    }
    if (filterForm.travel_date?.length > 0) {
      params += `&travel_date=${filterForm.travel_date}`
    }
    if (filterForm.return_date?.length > 0) {
      params += `&return_date=${filterForm.return_date}`
    }
    const getFlightsUrl = `http://localhost:3000/flights/search?${params}`;

    await axios.request({
      url: getFlightsUrl,
      method: 'get',
      headers: {
        'Content-Type': 'appplication/json'
      }
    }).then(function (response) {
      const flightsList = response.data.flights.map((flight) => {
        return (
          <li key={flight.id} className="list-group-item d-flex justify-content-between align-items-start flight-list-item">
            <div className="ms-2 me-auto flight-details">
              <div className="flex-column">
                <strong>Flight Number:</strong> {flight.flight_number}
                <strong>Airline Name:</strong> {flight.airline_name}
              </div>
              <div className="flex-column">
                <strong>Departure Time:</strong> {flight.departure_time}
                <strong>Arrival Time:</strong> {flight.arrival_time}
              </div>
              <div className="flex-column">
                <strong>Duration:</strong> {flight.duration_in_minutes} minutes
                <strong>Stops:</strong> {flight.number_of_stops}
              </div>
              <div className="flex-column">
                <strong>Price:</strong> {flight.price}
              </div>
            </div>
          </li>
        )
      })
      setFlights(flightsList);
    })
    .catch(function (error) {
      toast.error(error.response.data.error);
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFilterForm({
      ...filterForm,
      [name]: value,
    });
  }

  function searchFlights() {
    if (filterForm.source?.length === 0 || filterForm.destination?.length === 0 || filterForm.travel_date?.length === 0) {
      toast.error("Please provide source, destination and travel date");
    } else {
      getFlights();
    }
  }

  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="source">Source</label>
            <input value={filterForm.source} name="source" onChange={handleChange} type="text" className="form-control" id="source" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="destination">Destination</label>
            <input value={filterForm.destination} name="destination" onChange={handleChange} type="text" className="form-control" id="destination" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="travel_date">Travel Date</label>
            <input value={filterForm.travel_date} name="travel_date" onChange={handleChange} type="date" className="form-control" id="travel_date" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="return_date">Return Date</label>
            <input value={filterForm.return_date} name="return_date" onChange={handleChange} type="date" className="form-control" id="return_date" />
          </div>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-12 d-flex justify-content-end">
          <button type="button" onClick={searchFlights} className="btn btn-primary">
            Search
          </button>
        </div>
      </div>
      {flightsList}
    </div>
  )
}