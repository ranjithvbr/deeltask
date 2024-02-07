import React from "react";
import MockData from "./assert/mockData.json";
import { ReactComponent as ArrowForward } from "./assert/arrow-forward.svg";
import "./InvoiceList.css";
import { useNavigate } from "react-router-dom";

export interface itemTypes {
  first_name: string;
  last_name: string;
  from_date: string;
  to_date: string;
  address: string;
  country: string;
  invoice_no: string;
  basic_salary: number;
  allowance: number;
}

function InvoiceList() {
  const navigate = useNavigate();
  return (
    <>
      <h2>Invoice List</h2>
      <div className="list-continer">
        <table>
          <tbody>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Invoice Date</th>
              <th className="amount-cell">Total Due</th>
              <th>Action</th>
            </tr>
            {MockData.map((item: itemTypes, index: number) => {
              return (
                <tr
                  className="list-item"
                  key={item.invoice_no}
                  onClick={() =>
                    navigate(`/invoice-detail/${item.invoice_no}`, {
                      state: item,
                    })
                  }
                >
                  <td>{index + 1}</td>
                  <td>{item.first_name + " " + item.last_name}</td>
                  <td>
                    {item.from_date} - {item.to_date}
                  </td>
                  <td className="amount-cell">${item.basic_salary + item.allowance}</td>
                  <td>
                    <ArrowForward />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="end"> ---- End ---- </div>
      </div>
    </>
  );
}

export default InvoiceList;
