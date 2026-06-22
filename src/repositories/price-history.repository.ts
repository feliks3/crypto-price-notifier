import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { config } from '../config';

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
  const item: PriceHistoryItem = {
    email: input.email,
    createdAt: new Date().toISOString(),
    coin: input.coin,
    price: input.price,
    currency: input.currency
  };

  await docClient.send(
    new PutCommand({
      TableName: config.dynamodb.tableName,
      Item: item
    })
  );

  return item;
}

export async function getPriceHistory(): Promise<PriceHistoryItem[]> {
  const result = await docClient.send(
    new ScanCommand({
      TableName: config.dynamodb.tableName
    })
  );

  return (result.Items ?? []) as PriceHistoryItem[];
}
