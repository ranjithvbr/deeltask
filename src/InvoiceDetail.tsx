import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { PdfDownloader } from "./PdfDownloader";
import { InvoiceDataTypes } from "./InvoiceList";
import "./InvoiceDetail.css";

import { ReactComponent as DeelLogo } from "./assert/deel-logo-blue.svg";
import { ReactComponent as BackArrow } from "./assert/arrow-back.svg";

const InvoiceDetail = () => {
  const navigate = useNavigate();
  let location = useLocation();

  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDataTypes>({
    first_name: "",
    last_name: "",
    from_date: "",
    to_date: "",
    address: "",
    country: "",
    invoice_no: "",
    basic_salary: 0,
    allowance: 0,
  });

  useEffect(() => {
    if (location.state?.first_name) {
      setInvoiceDetails(location.state);
    } else {
      console.warn("No Data Found");
      navigate("/");
    }
  }, [location, navigate]);

  return (
    <div className={`invoice-container ${Capacitor.isNativePlatform() && "native-invoice-container"}`}>
      <div>
        <div className="invoice-header">
          <button className="back-button" onClick={() => navigate("/")}>
            <BackArrow /> Back
          </button>
          <h3>Invoice Detail</h3>
          <PdfDownloader invoiceDetails={invoiceDetails} />
        </div>
        <div className="invoice-detail-container">
          <DeelLogo />
          <h3 className="detail-header">INVOICE</h3>
          <div className="billing-from-container">
            <div className="billing-from-detail">
              Billing From:
              <div>
                {invoiceDetails?.first_name + " " + invoiceDetails?.last_name},<br />
                {invoiceDetails?.address},<br />
                {invoiceDetails?.country}
              </div>
            </div>
            <div className="invoice-dates">
              <div>
                Invoice No
                <br />
                Issue Date
                <br />
                Due Date
              </div>
              <div>
                {invoiceDetails?.invoice_no}
                <br />
                {invoiceDetails?.from_date}
                <br />
                {invoiceDetails?.to_date}
                <br />
              </div>
            </div>
          </div>
          <div className="billing-to-detail">
            Billing To:
            <div>
              Deel,
              <br />
              XYZXYZ,
              <br />
              000000
            </div>
          </div>
          <table className="invoice-table">
            <tbody>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
              <tr>
                <td>Basic Salary</td>
                <td>{invoiceDetails?.basic_salary}.00</td>
              </tr>
              <tr>
                <td>Allowance</td>
                <td>{invoiceDetails?.allowance}.00</td>
              </tr>
              <tr className="amount-container">
                <td>VAT Total</td>
                <td>0.00</td>
              </tr>
              <tr className="amount-container">
                <td>Total Due</td>
                <td>${invoiceDetails?.basic_salary + invoiceDetails?.allowance}.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
