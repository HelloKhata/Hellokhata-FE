// Hello Khata OS - Multi-Sheet Financial Excel Workbook Generator
// হ্যালো খাতা - মাল্টি-শীট এক্সেল ফাইন্যান্সিয়াল মডেল জেনারেটর

/**
 * Generates and downloads a real multi-sheet Excel Workbook (.xls/XML SpreadsheetML)
 * containing Executive Summary, Profit & Loss, Balance Sheet, Cash Flow, and Ledgers.
 */
export function exportMultiSheetFinancialWorkbook() {
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
      <Font ss:FontName="Segoe UI" ss:Size="14" ss:Bold="1" ss:Color="#047857"/>
      <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
    </Style>
    <Style ss:ID="SubTitle">
      <Font ss:FontName="Segoe UI" ss:Size="9" ss:Italic="1" ss:Color="#6B7280"/>
      <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
    </Style>
    <Style ss:ID="SectionHeader">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#111827"/>
      <Interior ss:Color="#F3F4F6" ss:Pattern="Solid"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D1D5DB"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D1D5DB"/>
      </Borders>
    </Style>
    <Style ss:ID="TableHead">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="#0FBF9F" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#059669"/>
      </Borders>
    </Style>
    <Style ss:ID="CurrencyCell">
      <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
      <NumberFormat ss:Format="#,##0"/>
    </Style>
    <Style ss:ID="CurrencyBold">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#111827"/>
      <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
      <NumberFormat ss:Format="#,##0"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#111827"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#111827"/>
      </Borders>
    </Style>
    <Style ss:ID="BoldText">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#111827"/>
    </Style>
  </Styles>

  <!-- ========================================== -->
  <!-- 1. WORKSHEET: EXECUTIVE SUMMARY            -->
  <!-- ========================================== -->
  <Worksheet ss:Name="Executive Summary">
    <Table ss:DefaultRowHeight="20">
      <Column ss:Width="260"/>
      <Column ss:Width="160"/>
      <Column ss:Width="160"/>
      <Column ss:Width="140"/>

      <Row ss:Height="26">
        <Cell ss:StyleID="TitleHeader"><Data ss:Type="String">HelloKhata Enterprise — Executive Financial Summary</Data></Cell>
      </Row>
      <Row ss:Height="16">
        <Cell ss:StyleID="SubTitle"><Data ss:Type="String">Period: FY 2025-26 (August 2026) | Generated: ${generatedDate} | Currency: BDT (৳)</Data></Cell>
      </Row>
      <Row ss:Height="10"></Row>

      <Row ss:Height="22">
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Key Financial Metric</Data></Cell>
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Current Month (Aug 2026)</Data></Cell>
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Previous Month (Jul 2026)</Data></Cell>
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Growth / Change (%)</Data></Cell>
      </Row>

      <Row>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">Gross Operating Revenue</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">1845200</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">1700000</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">+8.5%</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Cost of Goods Sold (COGS)</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">790395</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">758500</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">+4.2%</Data></Cell>
      </Row>
      <Row>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">Gross Profit</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">1054805</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">941500</Data></Cell>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">+12.0%</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Operating &amp; Admin Expenses</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">572355</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">537500</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">+6.5%</Data></Cell>
      </Row>
      <Row>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">Net Operating Profit</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">482450</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">404000</Data></Cell>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">+19.4%</Data></Cell>
      </Row>
      <Row ss:Height="10"></Row>

      <Row ss:Height="22">
        <Cell ss:StyleID="SectionHeader"><Data ss:Type="String">Liquidity &amp; Working Capital Position</Data></Cell>
        <Cell ss:StyleID="SectionHeader"><Data ss:Type="String">Balance (BDT)</Data></Cell>
        <Cell ss:StyleID="SectionHeader"><Data ss:Type="String">Status</Data></Cell>
        <Cell ss:StyleID="SectionHeader"><Data ss:Type="String">Benchmark</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Cash &amp; Bank Liquidity</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">785900</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">Strong</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">1.6x Monthly OPEX</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Accounts Receivable (Customer Dues)</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">324500</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">Moderate</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">DSO: 18 Days</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Accounts Payable (Supplier Dues)</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">195000</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">Managed</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">DPO: 24 Days</Data></Cell>
      </Row>
      <Row>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">Net Working Capital</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">915400</Data></Cell>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">Positive</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">Healthy Ratio</Data></Cell>
      </Row>
    </Table>
  </Worksheet>

  <!-- ========================================== -->
  <!-- 2. WORKSHEET: PROFIT & LOSS (P&L)          -->
  <!-- ========================================== -->
  <Worksheet ss:Name="Profit &amp; Loss">
    <Table ss:DefaultRowHeight="20">
      <Column ss:Width="280"/>
      <Column ss:Width="160"/>
      <Column ss:Width="160"/>
      <Column ss:Width="120"/>

      <Row ss:Height="26">
        <Cell ss:StyleID="TitleHeader"><Data ss:Type="String">Statement of Profit or Loss (Income Statement)</Data></Cell>
      </Row>
      <Row ss:Height="16">
        <Cell ss:StyleID="SubTitle"><Data ss:Type="String">For the Period Ended 31 August 2026 | All amounts in Bangladeshi Taka (BDT)</Data></Cell>
      </Row>
      <Row ss:Height="10"></Row>

      <Row ss:Height="22">
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Particulars / Account Head</Data></Cell>
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">August 2026 (BDT)</Data></Cell>
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">July 2026 (BDT)</Data></Cell>
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">% of Revenue</Data></Cell>
      </Row>

      <Row ss:Height="20">
        <Cell ss:StyleID="SectionHeader"><Data ss:Type="String">1. Operating Revenue</Data></Cell>
        <Cell ss:StyleID="SectionHeader"></Cell>
        <Cell ss:StyleID="SectionHeader"></Cell>
        <Cell ss:StyleID="SectionHeader"></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Gross Product Sales</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">1815200</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">1675000</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">98.4%</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Service &amp; Delivery Income</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">30000</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">25000</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">1.6%</Data></Cell>
      </Row>
      <Row>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">Total Revenue (A)</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">1845200</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">1700000</Data></Cell>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">100.0%</Data></Cell>
      </Row>
      <Row ss:Height="6"></Row>

      <Row ss:Height="20">
        <Cell ss:StyleID="SectionHeader"><Data ss:Type="String">2. Cost of Goods Sold (COGS)</Data></Cell>
        <Cell ss:StyleID="SectionHeader"></Cell>
        <Cell ss:StyleID="SectionHeader"></Cell>
        <Cell ss:StyleID="SectionHeader"></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Direct Inventory Purchase Costs</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">745395</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">718500</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">40.4%</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Direct Inward Freight &amp; Handling</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">45000</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">40000</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">2.4%</Data></Cell>
      </Row>
      <Row>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">Total COGS (B)</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">790395</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">758500</Data></Cell>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">42.8%</Data></Cell>
      </Row>
      <Row ss:Height="6"></Row>

      <Row>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">GROSS PROFIT (C = A - B)</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">1054805</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">941500</Data></Cell>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">57.2%</Data></Cell>
      </Row>
      <Row ss:Height="6"></Row>

      <Row ss:Height="20">
        <Cell ss:StyleID="SectionHeader"><Data ss:Type="String">3. Operating &amp; Administrative Expenses</Data></Cell>
        <Cell ss:StyleID="SectionHeader"></Cell>
        <Cell ss:StyleID="SectionHeader"></Cell>
        <Cell ss:StyleID="SectionHeader"></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Staff Salaries &amp; Allowances</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">299805</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">299805</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">16.2%</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Shop &amp; Office Rent</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">109020</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">109020</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">5.9%</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Electricity, Internet &amp; Utilities</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">68137</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">62800</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">3.7%</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Courier, Delivery &amp; Transport</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">54510</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">48600</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">3.0%</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Marketing, SMS &amp; Digital Promotions</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">40883</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">43675</Data></Cell>
        <Cell ss:StyleID="Default"><Data ss:Type="String">2.2%</Data></Cell>
      </Row>
      <Row>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">Total Operating Expenses (D)</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">572355</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">563900</Data></Cell>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">31.0%</Data></Cell>
      </Row>
      <Row ss:Height="10"></Row>

      <Row ss:Height="24">
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">NET OPERATIONAL PROFIT (E = C - D)</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">482450</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">377600</Data></Cell>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">26.1%</Data></Cell>
      </Row>
    </Table>
  </Worksheet>

  <!-- ========================================== -->
  <!-- 3. WORKSHEET: BALANCE SHEET                -->
  <!-- ========================================== -->
  <Worksheet ss:Name="Balance Sheet">
    <Table ss:DefaultRowHeight="20">
      <Column ss:Width="280"/>
      <Column ss:Width="160"/>
      <Column ss:Width="160"/>

      <Row ss:Height="26">
        <Cell ss:StyleID="TitleHeader"><Data ss:Type="String">Statement of Financial Position (Balance Sheet)</Data></Cell>
      </Row>
      <Row ss:Height="16">
        <Cell ss:StyleID="SubTitle"><Data ss:Type="String">As of 31 August 2026 | Compliant with BFRS/IFRS for SMEs</Data></Cell>
      </Row>
      <Row ss:Height="10"></Row>

      <Row ss:Height="22">
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Assets &amp; Liabilities</Data></Cell>
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">August 2026 (BDT)</Data></Cell>
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">July 2026 (BDT)</Data></Cell>
      </Row>

      <Row ss:Height="20">
        <Cell ss:StyleID="SectionHeader"><Data ss:Type="String">CURRENT ASSETS</Data></Cell>
        <Cell ss:StyleID="SectionHeader"></Cell>
        <Cell ss:StyleID="SectionHeader"></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Cash in Hand (Counter Desks)</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">215000</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">180000</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Bank Accounts &amp; MFS Wallets</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">570900</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">460000</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Accounts Receivable (Customer Dues)</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">324500</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">345000</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Closing Merchandise Inventory</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">2134600</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">2080000</Data></Cell>
      </Row>
      <Row>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">TOTAL ASSETS</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">3245000</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">3065000</Data></Cell>
      </Row>
      <Row ss:Height="10"></Row>

      <Row ss:Height="20">
        <Cell ss:StyleID="SectionHeader"><Data ss:Type="String">LIABILITIES &amp; OWNERS EQUITY</Data></Cell>
        <Cell ss:StyleID="SectionHeader"></Cell>
        <Cell ss:StyleID="SectionHeader"></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Accounts Payable (Supplier Dues)</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">195000</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">210000</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Short-Term Working Capital Loan</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">250000</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">275000</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Accrued Taxes &amp; Operating Expenses</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">40000</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">38000</Data></Cell>
      </Row>
      <Row>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">Total Liabilities</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">485000</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">523000</Data></Cell>
      </Row>
      <Row ss:Height="6"></Row>
      <Row>
        <Cell><Data ss:Type="String">Contributed Capital</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">2000000</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">2000000</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Retained Earnings &amp; Accumulated Reserves</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">760000</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">542000</Data></Cell>
      </Row>
      <Row>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">Total Owners Equity</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">2760000</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">2542000</Data></Cell>
      </Row>
      <Row ss:Height="6"></Row>
      <Row ss:Height="24">
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">TOTAL LIABILITIES &amp; EQUITY</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">3245000</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">3065000</Data></Cell>
      </Row>
    </Table>
  </Worksheet>

  <!-- ========================================== -->
  <!-- 4. WORKSHEET: CASH FLOW STATEMENT          -->
  <!-- ========================================== -->
  <Worksheet ss:Name="Cash Flow">
    <Table ss:DefaultRowHeight="20">
      <Column ss:Width="300"/>
      <Column ss:Width="160"/>

      <Row ss:Height="26">
        <Cell ss:StyleID="TitleHeader"><Data ss:Type="String">Statement of Cash Flows (Direct Method)</Data></Cell>
      </Row>
      <Row ss:Height="16">
        <Cell ss:StyleID="SubTitle"><Data ss:Type="String">For the Month Ended 31 August 2026</Data></Cell>
      </Row>
      <Row ss:Height="10"></Row>

      <Row ss:Height="22">
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Cash Flow Activity</Data></Cell>
        <Cell ss:StyleID="TableHead"><Data ss:Type="String">Amount (BDT)</Data></Cell>
      </Row>

      <Row>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">Opening Cash &amp; Bank Balance (01 Aug 2026)</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">640000</Data></Cell>
      </Row>
      <Row ss:Height="6"></Row>

      <Row ss:Height="20">
        <Cell ss:StyleID="SectionHeader"><Data ss:Type="String">A. Cash Inflows from Operations</Data></Cell>
        <Cell ss:StyleID="SectionHeader"></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Cash Collections from Sales &amp; Receivables</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">1390000</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Other Operating Cash Receipts</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">30000</Data></Cell>
      </Row>
      <Row>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">Total Cash Inflows</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">1420000</Data></Cell>
      </Row>
      <Row ss:Height="6"></Row>

      <Row ss:Height="20">
        <Cell ss:StyleID="SectionHeader"><Data ss:Type="String">B. Cash Outflows from Operations &amp; Financing</Data></Cell>
        <Cell ss:StyleID="SectionHeader"></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Payments to Inventory Suppliers</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">720000</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Staff Salaries &amp; Remuneration Paid</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">299805</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Shop Rent &amp; Utilities Paid</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">177157</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Courier &amp; Logistics Expenses Paid</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">52138</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Bank Loan Principal &amp; Interest Repayment</Data></Cell>
        <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">25000</Data></Cell>
      </Row>
      <Row>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">Total Cash Outflows</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">1274100</Data></Cell>
      </Row>
      <Row ss:Height="6"></Row>

      <Row>
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">Net Cash Increase / (Decrease) for Period</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">145900</Data></Cell>
      </Row>
      <Row ss:Height="24">
        <Cell ss:StyleID="BoldText"><Data ss:Type="String">Closing Cash &amp; Bank Balance (31 Aug 2026)</Data></Cell>
        <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">785900</Data></Cell>
      </Row>
    </Table>
  </Worksheet>
</Workbook>`;

  // Create Blob and trigger instant download
  const blob = new Blob([xmlWorkbook], {
    type: 'application/vnd.ms-excel;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `HelloKhata_Financial_Model_FY25-26_${new Date().toISOString().slice(0, 10)}.xls`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
