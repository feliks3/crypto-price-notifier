import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.PRICE_HISTORY_TABLE;

export type SavePriceHistoryInput = {
  coin: string;
  price: number;
  currency: string;
  email: string;
};

export async function savePriceHistory(input: SavePriceHistoryInput) {
  if (!tableName) {
    throw new Error('PRICE_HISTORY_TABLE is not configured');
  }

  const item = {
    id: randomUUID(),
    coin: input.coin,
    price: input.price,
    currency: input.currency,
    email: input.email,
    createdAt: new Date().toISOString(),
  };

  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: item,
    }),
  );

  return item;
}