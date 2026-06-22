import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export type SavePriceHistoryInput = {
  coin: string;
  price: number;
  currency: string;
  email: string;
};

export type PriceHistoryItem = {
  email: string;
  createdAt: string;
  coin: string;
  price: number;
  currency: string;
};

export async function savePriceHistory(input: SavePriceHistoryInput): Promise<PriceHistoryItem> {
  const tableName = process.env.PRICE_HISTORY_TABLE;
  if (!tableName) {
    throw new Error('PRICE_HISTORY_TABLE is not configured');
  }

  const item: PriceHistoryItem = {
    email: input.email,
    createdAt: new Date().toISOString(),
    coin: input.coin,
    price: input.price,
    currency: input.currency
  };

  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: item
    })
  );

  return item;
}

export async function getPriceHistory(): Promise<PriceHistoryItem[]> {
  const tableName = process.env.PRICE_HISTORY_TABLE;
  if (!tableName) {
    throw new Error('PRICE_HISTORY_TABLE is not configured');
  }

  const result = await docClient.send(
    new ScanCommand({
      TableName: tableName
    })
  );

  return (result.Items ?? []) as PriceHistoryItem[];
}
