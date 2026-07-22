export const mockInvoices = [
  {
    id: 'INV-10928',
    trackingNumber: 'TRK987654321',
    description: 'Delivery Fee - Express Shipping',
    amount: 45.00,
    currency: 'GHS',
    date: '2026-07-15T09:30:00Z',
    status: 'pending', // pending
    shipmentStatus: 'in_transit' // To know if it can be refunded if paid
  },
  {
    id: 'INV-10935',
    trackingNumber: 'TRK456789123',
    description: 'Delivery Fee - Standard Shipping',
    amount: 25.00,
    currency: 'GHS',
    date: '2026-07-16T14:20:00Z',
    status: 'pending',
    shipmentStatus: 'pending'
  }
]

export const mockReceipts = [
  {
    id: 'RCPT-88219',
    invoiceId: 'INV-10800',
    trackingNumber: 'TRK112233445',
    description: 'Delivery Fee - Standard Shipping',
    amount: 25.00,
    currency: 'GHS',
    date: '2026-06-21T10:15:00Z',
    paymentMethod: 'Mobile Money',
    status: 'paid',
    shipmentStatus: 'delivered' // Cannot be refunded
  },
  {
    id: 'RCPT-88401',
    invoiceId: 'INV-10850',
    trackingNumber: 'TRK998877665',
    description: 'Delivery Fee - Express Shipping',
    amount: 50.00,
    currency: 'GHS',
    date: '2026-06-25T11:45:00Z',
    paymentMethod: 'Paystack',
    status: 'paid',
    shipmentStatus: 'ready_for_pickup' // Cannot be refunded
  },
  {
    id: 'RCPT-88902',
    invoiceId: 'INV-10901',
    trackingNumber: 'TRK778899001',
    description: 'Delivery Fee - Next Day',
    amount: 80.00,
    currency: 'GHS',
    date: '2026-07-08T09:00:00Z',
    paymentMethod: 'Hubtel',
    status: 'paid',
    shipmentStatus: 'lost' // CAN be refunded!
  },
  {
    id: 'RCPT-88910',
    invoiceId: 'INV-10905',
    trackingNumber: 'TRK334455667',
    description: 'Delivery Fee - Standard',
    amount: 30.00,
    currency: 'GHS',
    date: '2026-07-10T15:20:00Z',
    paymentMethod: 'Mobile Money',
    status: 'paid',
    shipmentStatus: 'returned' // CAN be refunded!
  }
]

export const mockRefunds = [
  {
    id: 'RFND-001',
    receiptId: 'RCPT-88902',
    trackingNumber: 'TRK778899001',
    amount: 80.00,
    currency: 'GHS',
    dateRequested: '2026-07-18T10:00:00Z',
    status: 'pending_auth', // pending_auth, approved, rejected
    reason: 'Parcel was reported lost, requesting refund for delivery fee.'
  }
]
