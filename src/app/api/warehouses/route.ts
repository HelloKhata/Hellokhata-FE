import { NextResponse } from 'next/server';

// In a real app, this would connect to a database
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.code) {
      return NextResponse.json(
        { error: 'Name and code are required' },
        { status: 400 }
      );
    }

    // Mock creating a warehouse in the DB
    const newWarehouse = {
      id: `wh-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      productsCount: 0,
      stockValue: 0,
      totalStockUnits: 0,
      availableUnits: 0,
    };

    return NextResponse.json(newWarehouse, { status: 201 });
  } catch (error) {
    console.error('Error creating warehouse:', error);
    return NextResponse.json(
      { error: 'Failed to create warehouse' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // Mock fetching warehouses
  return NextResponse.json([
    {
      id: 'wh-1',
      name: 'Main Central Warehouse',
      code: 'WH-001',
      location: 'Plot 45, Sector 7, Uttara, Dhaka',
      managerName: 'Rahim Uddin',
      managerPhone: '01711000000',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      productsCount: 1500,
      stockValue: 2500000,
      totalStockUnits: 12000,
      availableUnits: 11500,
    }
  ]);
}
