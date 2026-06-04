import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Svg, Path, Circle, Line } from '@react-pdf/renderer';
import { formatCurrency, formatDate } from "@/lib/utils/format";

// Register fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 'bold' },
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333333'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    position: 'relative',
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  brandSub: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    textTransform: 'uppercase',
    textAlign: 'right'
  },
  invoiceMeta: {
    fontSize: 9,
    color: '#64748b',
    textAlign: 'right',
    marginTop: 4
  },
  billingPeriod: {
    marginTop: 8,
    padding: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  billingPeriodText: {
    fontSize: 8,
    color: '#475569',
    textAlign: 'right'
  },
  detailsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  detailLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 4
  },
  detailValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a'
  },
  detailSub: {
    fontSize: 9,
    color: '#475569',
    marginTop: 2
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  summaryBox: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 4
  },
  summaryValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a'
  },
  summaryValueHighlight: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0284c7'
  },
  summaryValueDanger: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#e11d48'
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  table: {
    width: '100%',
    marginBottom: 24,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 6,
    marginBottom: 6,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 6,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#475569',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingHorizontal: 6,
  },
  tableCell: {
    fontSize: 9,
    color: '#334155',
  },
  col1: { width: '25%' },
  col2: { width: '35%' },
  col3: { width: '10%', textAlign: 'right' },
  col4: { width: '15%', textAlign: 'right' },
  col5: { width: '15%', textAlign: 'right' },
  
  // Layout for bottom elements (Garment Summary + Calculations side-by-side)
  bottomLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 24,
    marginBottom: 24,
  },
  bottomLeft: {
    flex: 1,
  },
  bottomRight: {
    width: 220,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  calcLabel: {
    fontSize: 9,
    color: '#475569',
  },
  calcValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  calcValueDanger: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#e11d48',
  },
  calcValueSuccess: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
    paddingTop: 6,
    marginTop: 6,
  },
  grandTotalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  grandTotalValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0284c7',
  },

  // Garment summary table styling inside PDF
  summaryTable: {
    width: '100%',
  },
  summaryTableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 4,
    marginBottom: 4,
  },
  summaryTableHeaderCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#475569',
  },
  summaryTableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  summaryTableCell: {
    fontSize: 9,
    color: '#334155',
  },
  sumCol1: { width: '50%' },
  sumCol2: { width: '25%', textAlign: 'right' },
  sumCol3: { width: '25%', textAlign: 'right' },

  footer: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8',
  }
});

export const InvoiceDocument = ({ invoice }: { invoice: any }) => {
  // Group detailed work entries by work_date, garment_name, and rate (no time)
  const groupedEntries = new Map<string, { date: string; garment: string; rate: number; qty: number; amount: number }>();
  (invoice.invoice_items ?? []).forEach((item: any) => {
    const dateKey = item.work_date;
    const key = `${dateKey}_${item.garment_name}_${item.rate}`;
    if (groupedEntries.has(key)) {
      const existing = groupedEntries.get(key)!;
      existing.qty += Number(item.quantity);
      existing.amount += Number(item.amount);
    } else {
      groupedEntries.set(key, {
        date: dateKey,
        garment: item.garment_name,
        rate: Number(item.rate),
        qty: Number(item.quantity),
        amount: Number(item.amount)
      });
    }
  });

  const consolidatedItems = Array.from(groupedEntries.values()).sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Calculate garment summaries
  const garmentSummaries = new Map<string, { qty: number; amount: number }>();
  (invoice.invoice_items ?? []).forEach((item: any) => {
    const existing = garmentSummaries.get(item.garment_name) || { qty: 0, amount: 0 };
    garmentSummaries.set(item.garment_name, {
      qty: existing.qty + Number(item.quantity),
      amount: existing.amount + Number(item.amount)
    });
  });
  const summaryItems = Array.from(garmentSummaries.entries());

  const amountDue = Math.max(Number(invoice.grand_total), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <View style={styles.logoContainer}>
              {/* Shirt Icon */}
              <Svg width="18" height="18" viewBox="0 0 24 24" style={{ position: 'absolute', top: 4, left: 4 }}>
                <Path d="M20.38 3.46 16 7.57l-1-1-4.8 4.8-.4-.4L12 8.12l-1.12-1.12L6 12l-1.88-1.88L3 11v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V11Z" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M18 21V15" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                <Path d="M6 21V15" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                <Path d="M3 11h18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                <Path d="M15 3h6v6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              </Svg>
              {/* Scissors Icon */}
              <Svg width="9" height="9" viewBox="0 0 24 24" style={{ position: 'absolute', bottom: 2, right: 2 }}>
                <Circle cx="6" cy="6" r="3" stroke="#ffffff" strokeWidth="2.5" fill="none" />
                <Circle cx="6" cy="18" r="3" stroke="#ffffff" strokeWidth="2.5" fill="none" />
                <Line x1="20" y1="4" x2="8.12" y2="15.88" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                <Line x1="14.47" y1="14.48" x2="20" y2="20" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                <Line x1="8.12" y1="8.12" x2="12" y2="12" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              </Svg>
            </View>
            <View>
              <Text style={styles.brandName}>AFKB</Text>
              <Text style={styles.brandSub}>Garment Processing</Text>
            </View>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceMeta}>{invoice.invoice_number}</Text>
            <Text style={styles.invoiceMeta}>Date: {formatDate(invoice.invoice_date)}</Text>
            {invoice.timestamp_from && invoice.timestamp_to && (
              <View style={styles.billingPeriod}>
                <Text style={styles.billingPeriodText}>BILLING PERIOD</Text>
                <Text style={styles.billingPeriodText}>
                  {new Date(invoice.timestamp_from).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  {' -> '}
                  {new Date(invoice.timestamp_to).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Customer Details */}
        <View style={styles.detailsSection}>
          <View>
            <Text style={styles.detailLabel}>Billed To</Text>
            <Text style={styles.detailValue}>{invoice.shops?.shop_name}</Text>
            {invoice.shops?.phone_number && <Text style={styles.detailSub}>{invoice.shops.phone_number}</Text>}
          </View>
          <View>
            <Text style={[styles.detailLabel, { textAlign: 'right' }]}>Generated By</Text>
            <Text style={[styles.detailValue, { textAlign: 'right' }]}>AFKB System</Text>
            <Text style={[styles.detailSub, { textAlign: 'right' }]}>Authorized Signatory</Text>
          </View>
        </View>

        {/* Previous Billing Summary */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Previous Bill</Text>
            <Text style={styles.summaryValue}>
              {invoice.previous_invoice ? formatCurrency(Number(invoice.previous_invoice.subtotal)) : "₹0"}
            </Text>
            {invoice.previous_invoice && (
              <Text style={{ fontSize: 8, color: '#94a3b8', marginTop: 4 }}>
                {invoice.previous_invoice.invoice_number}
              </Text>
            )}
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Last Payment</Text>
            <Text style={[styles.summaryValue, { color: '#16a34a' }]}>
              {invoice.last_payment ? formatCurrency(Number(invoice.last_payment.amount)) : "₹0"}
            </Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Outstanding Carried</Text>
            <Text style={styles.summaryValueDanger}>
              {formatCurrency(Number(invoice.previous_balance))}
            </Text>
          </View>
          <View style={[styles.summaryBox, { alignItems: 'flex-end' }]}>
            <Text style={styles.summaryLabel}>Final Amount Due</Text>
            <Text style={styles.summaryValueHighlight}>
              {formatCurrency(amountDue)}
            </Text>
          </View>
        </View>

        {/* Detailed Work Entries Table */}
        <View style={{ marginBottom: 8 }}>
          <Text style={styles.sectionTitle}>Detailed Work Entries</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.col1]}>Date</Text>
            <Text style={[styles.tableHeaderCell, styles.col2]}>Garment</Text>
            <Text style={[styles.tableHeaderCell, styles.col3]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.col4]}>Rate</Text>
            <Text style={[styles.tableHeaderCell, styles.col5]}>Amount</Text>
          </View>

          {/* Table Rows */}
          {consolidatedItems.map((item: any, idx: number) => {
            const dt = new Date(item.date);
            const formattedDate = dt.toLocaleDateString("en-IN", { day: '2-digit', month: 'short' });

            return (
              <View key={idx} style={styles.tableRow} wrap={false}>
                <Text style={[styles.tableCell, styles.col1, { fontWeight: 'bold' }]}>
                  {formattedDate}
                </Text>
                <Text style={[styles.tableCell, styles.col2]}>{item.garment}</Text>
                <Text style={[styles.tableCell, styles.col3]}>{Number(item.qty)}</Text>
                <Text style={[styles.tableCell, styles.col4]}>₹{Number(item.rate)}</Text>
                <Text style={[styles.tableCell, styles.col5, { fontWeight: 'bold' }]}>
                  ₹{Number(item.amount)}
                </Text>
              </View>
            );
          })}
          {consolidatedItems.length === 0 && (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#94a3b8', fontSize: 10 }}>No entries found for this invoice.</Text>
            </View>
          )}
        </View>

        {/* Garment Summary & Calculations Side-by-Side */}
        <View style={styles.bottomLayout} wrap={false}>
          {/* Garment Summary Table */}
          <View style={styles.bottomLeft}>
            <Text style={styles.sectionTitle}>Garment Summary</Text>
            <View style={styles.summaryTable}>
              <View style={styles.summaryTableHeader}>
                <Text style={[styles.summaryTableHeaderCell, styles.sumCol1]}>Item</Text>
                <Text style={[styles.summaryTableHeaderCell, styles.sumCol2]}>Total Qty</Text>
                <Text style={[styles.summaryTableHeaderCell, styles.sumCol3]}>Amount</Text>
              </View>
              {summaryItems.map(([name, stats]) => (
                <View key={name} style={styles.summaryTableRow}>
                  <Text style={[styles.summaryTableCell, styles.sumCol1]}>{name}</Text>
                  <Text style={[styles.summaryTableCell, styles.sumCol2, { fontWeight: 'bold' }]}>{stats.qty}</Text>
                  <Text style={[styles.summaryTableCell, styles.sumCol3, { fontWeight: 'bold' }]}>₹{stats.amount}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Final Calculations Block */}
          <View style={styles.bottomRight}>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Current Charges</Text>
              <Text style={styles.calcValue}>{formatCurrency(Number(invoice.subtotal))}</Text>
            </View>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Previous Balance</Text>
              <Text style={styles.calcValueDanger}>{formatCurrency(Number(invoice.previous_balance))}</Text>
            </View>
            {Number(invoice.credit_applied) > 0 && (
              <View style={styles.calcRow}>
                <Text style={[styles.calcLabel, { color: '#16a34a' }]}>Credit Applied</Text>
                <Text style={styles.calcValueSuccess}>-{formatCurrency(Number(invoice.credit_applied))}</Text>
              </View>
            )}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>{formatCurrency(amountDue)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} wrap={false}>
          <View>
            <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 }}>
              Thank you for your business!
            </Text>
            <Text style={styles.footerText}>Prompt payment is highly appreciated.</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <View style={{ width: 100, borderBottomWidth: 1, borderBottomColor: '#cbd5e1', marginBottom: 6 }} />
            <Text style={styles.footerText}>AUTHORIZED SIGNATORY</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
