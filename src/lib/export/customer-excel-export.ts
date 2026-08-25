// Hello Khata OS - Customer Reports Multi-Sheet Excel Exporter
// হ্যালো খাতা - গ্রাহক রিপোর্টস এক্সেল এক্সপোর্টার

import type { CustomerDetailedRecord, TopCustomerItem } from '@/components/reports/customers/types';

export function exportCustomerReportsExcel(
  detailedRecords: CustomerDetailedRecord[],
  topCustomers: TopCustomerItem[]
) {
  const generatedDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const xmlWorkbook = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:html="http://www.w3.org/TR/REC-html40">
  
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Center"/>
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#000000"/>
    </Style>
    <Style ss:ID="TitleHeader">
      <Font ss:FontName="Segoe UI" ss:Size="14" ss:Bold="1" ss:Color="#2563EB"/>
      <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
    </Style>
    <Style ss:ID="SubTitle">
      <Font ss:FontName="Segoe UI" ss:Size="9" ss:Italic="1" ss:Color="#6B7280"/>
    </Style>
    <Style ss:ID="TableHead">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="#2563EB" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    </Style>
    <Style ss:ID="CurrencyCell">
      <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
      <NumberFormat ss:Format="#,##0"/>
    </Style>
    <Style ss:ID="BoldText">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#111827"/>
    </Style>
  </Styles>

  <!-- SHEET 1: CUSTOMER MASTER LEDGER -->
  <Worksheet ss:Name="Customer Master Report">
    <Table ss:DefaultRowHeight="20">
      <Column ss:Width="100"/>
      <Column ss:Width="180"/>
      <Column ss:Width="120"/>
      <Column ss:Width="140"/>
      <Column ss:Width="80"/>
      <Column ss:Width="130"/>
      <Column ss:Width="130"/>
      <Column ss:Width="130"/>
      <Column ss:Width="110"/>
      <Column ss:Width="90"/>

      <Row ss:Height="26">
        <Cell ss:StyleID="TitleHeader"><Data ss:Type="String">HelloKhata Enterprise — Customer Master Performance Report</Data></Cell>
      </Row>
      <Row ss:Height="16">
        <Cell ss:StyleID="SubTitle"><Data ss:Type="String">Generated: ${generatedDate} | Currency: BDT (৳)</Data></Cell>
      </Row>
      <Row ss:Height="10"></Row>

      <Row ss:Height="22">
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Customer ID</Data></Cell>
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Customer Name</Data></Cell>
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Phone</Data></Cell>
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Branch</Data></Cell>
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Orders</Data></Cell>
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Total Sales (৳)</Data></Cell>
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Total Paid (৳)</Data></Cell>
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Current Due (৳)</Data></Cell>
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Last Purchase</Data></Cell>
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Status</Data></Cell>
      </Row>

      ${detailedRecords
        .map(
          (r) => `
      <Row>
        <Cell ss:StyleID="Default"><Data ss:Type="String">${r.customerId}</Data></Cell>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">${r.name}</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">${r.phone}</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">${r.branch}</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="Number">${r.purchases}</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">${r.sales}</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">${r.paid}</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">${r.due}</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">${r.lastPurchase}</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">${r.status}</Data></Cell>
      </Row>`
        )
        .join('')}
    </Table>
  </Worksheet>

  <!-- SHEET 2: TOP CUSTOMERS -->
  <Worksheet ss:Name="Top Customers">
    <Table ss:DefaultRowHeight="20">
      <Column ss:Width="180"/>
      <Column ss:Width="120"/>
      <Column ss:Width="80"/>
      <Column ss:Width="140"/>
      <Column ss:Width="140"/>
      <Column ss:Width="140"/>
      <Column ss:Width="100"/>

      <Row ss:Height="26">
        <Cell ss:StyleID="TitleHeader"><Data ss:Type="String">Top Spenders &amp; Key Accounts</Data></Cell>
      </Row>
      <Row ss:Height="10"></Row>

      <Row ss:Height="22">
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Customer Name</Data></Cell>
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Phone</Data></Cell>
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Orders</Data></Cell>
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Total Sales (৳)</Data></Cell>
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Total Paid (৳)</Data></Cell>
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Outstanding Due (৳)</Data></Cell>
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Tier</Data></Cell>
      </Row>

      ${topCustomers
        .map(
          (c) => `
      <Row>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">${c.name}</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">${c.phone}</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="Number">${c.purchasesCount}</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">${c.totalSales}</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">${c.totalPaid}</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">${c.currentDue}</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">${c.tier}</Data></Cell>
      </Row>`
        )
        .join('')}
    </Table>
  </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlWorkbook], {
    type: 'application/vnd.ms-excel;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `HelloKhata_Customer_Reports_${new Date().toISOString().slice(0, 10)}.xls`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
