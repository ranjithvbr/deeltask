import { useCallback } from "react";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { LocalNotifications } from "@capacitor/local-notifications";
import pdfMake from "pdfmake/build/pdfmake";
import { TCreatedPdf } from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { itemTypes } from "./InvoiceList";
import DeelLogo from "./assert/deel.jpg";

import { ReactComponent as Download } from "./assert/download.svg";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function downloadWebPdf(pdfDoc: TCreatedPdf, fileName: string) {
  pdfDoc.getBlob((blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

const sendDownloadNotification = () => {
  LocalNotifications.schedule({
    notifications: [
      {
        title: "Download Complete",
        body: "Your file has been downloaded successfully!",
        id: 1,
      },
    ],
  });
};

export const PdfDownloader: React.FC<{ invoiceDetails: itemTypes }> = ({ invoiceDetails }) => {
  const handleInvoiceDownload = useCallback(async () => {
    try {
      await LocalNotifications.requestPermissions();
      const docDefinition: any = {
        content: [
          {
            columns: [
              {
                alignment: "left",
                image: DeelLogo,
                width: 60,
                height: 20,
              },
              { text: "INVOICE", style: "header" },
              { text: "" },
            ],
          },
          { text: "Billing From:" },
          {
            columns: [
              {
                columns: [
                  {
                    text: `${invoiceDetails?.first_name + " " + invoiceDetails?.last_name}\n${invoiceDetails?.address},\n${
                      invoiceDetails?.country
                    }`,
                    bold: true,
                  },
                ],
              },
              {
                style: "alignRight",
                columns: [
                  { text: "Invoice No\nIssue Date\nDue Date" },
                  { text: `${invoiceDetails?.invoice_no}\n${invoiceDetails?.from_date}\n${invoiceDetails?.to_date}`, bold: true },
                ],
              },
            ],
          },
          { text: "Billing To:", margin: [0, 20, 0, 0] },
          { text: "Deel,\nXYZXYZ,\n000000", bold: true },
          {
            margin: [0, 40, 0, 40],
            table: {
              widths: ["*", 200],
              body: [
                [
                  { text: "Description", fillColor: "#cccccc" },
                  { text: "Amount", fillColor: "#cccccc", alignment: "right" },
                ],
                ["Basic Salary", { text: `${invoiceDetails?.basic_salary}.00`, style: "alignRight" }],
                ["Allowance", { text: `${invoiceDetails?.allowance}.00`, style: "alignRight" }],
                [
                  { text: "VAT Total", style: "amountCell", border: [false, false, false, false] },
                  { text: "0.00", style: "amountCell", border: [false, false, false, false] },
                ],
                [
                  { text: "Total Due", style: "amountCell", border: [false, false, false, false] },
                  {
                    text: `$${invoiceDetails?.basic_salary + invoiceDetails?.allowance}.00`,
                    style: "amountCell",
                    border: [false, false, false, false],
                  },
                ],
              ],
            },
          },
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 50],
            alignment: "right",
          },
          amountCell: {
            bold: true,
            alignment: "right",
          },
          alignRight: {
            alignment: "right",
          },
        },
      };
      const fileName = invoiceDetails?.first_name + "_" + invoiceDetails?.invoice_no;
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      if (Capacitor.getPlatform() === "web") {
        downloadWebPdf(pdfDocGenerator, fileName);
      } else {
        pdfDocGenerator.getBase64((base64: string) => {
          Filesystem.writeFile({
            path: fileName,
            directory: Directory.Documents,
            data: base64,
          })
            .then(() => {
              sendDownloadNotification();
            })
            .catch(() => {
              console.warn(`Unable to write the file`);
            });
        });
      }
    } catch {
      console.warn(`something went wrong while generating pdf`);
    }
  }, [invoiceDetails]);

  return (
    <button onClick={handleInvoiceDownload}>
      <Download /> Download
    </button>
  );
};
