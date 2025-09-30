import { Card, Table, Badge, Button } from 'flowbite-react';
import { HiPlus } from 'react-icons/hi';

export default function RecentTransactions() {
  const transactions = [
    { id: 1, description: 'Supermercado', amount: '-$45,000', category: 'Alimentación', date: '15/05/2023', type: 'expense' },
    { id: 2, description: 'Pago de sueldo', amount: '+$800,000', category: 'Ingreso', date: '10/05/2023', type: 'income' },
    { id: 3, description: 'Gasolina', amount: '-$30,000', category: 'Transporte', date: '08/05/2023', type: 'expense' },
    { id: 4, description: 'Netflix', amount: '-$9,990', category: 'Entretenimiento', date: '05/05/2023', type: 'expense' },
    { id: 5, description: 'Pago de deuda', amount: '-$150,000', category: 'Deudas', date: '01/05/2023', type: 'expense' }
  ];

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-xl font-bold text-gray-800">Transacciones Recientes</h5>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <HiPlus className="mr-2 h-4 w-4" />
          Nueva
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>Descripción</Table.HeadCell>
            <Table.HeadCell>Monto</Table.HeadCell>
            <Table.HeadCell>Fecha</Table.HeadCell>
            <Table.HeadCell>Categoría</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {transactions.map((transaction) => (
              <Table.Row key={transaction.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {transaction.description}
                </Table.Cell>
                <Table.Cell className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                  {transaction.amount}
                </Table.Cell>
                <Table.Cell>{transaction.date}</Table.Cell>
                <Table.Cell>
                  <Badge color={transaction.type === 'income' ? 'success' : 'failure'} className="w-fit">
                    {transaction.category}
                  </Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </Card>
  );
}