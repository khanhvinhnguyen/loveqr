import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: process.env.CLOUD_REGION!,
  endpoint: process.env.CLOUD_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.CLOUD_ACCESS_KEY!,
    secretAccessKey: process.env.CLOUD_SECRET_KEY!,
  },
  forcePathStyle: true,
  tls: process.env.CLOUD_ENDPOINT!.startsWith('https'),
});

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const filename = searchParams.get('filename');
  const filetype = searchParams.get('filetype');

  if (!filename || !filetype) {
    return NextResponse.json(
      { error: 'filename & filetype are required' },
      { status: 400 },
    );
  }

  const key = `uploads/${Date.now()}_${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.CLOUD_BUCKET_NAME!,
    Key: key,
    ContentType: filetype,
    ACL: 'public-read',
  });

  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 360 });
    return NextResponse.json({ url, key });
  } catch (err: any) {
    console.error('presign error:', err);
    return NextResponse.json(
      { error: 'Failed to generate URL' },
      { status: 500 },
    );
  }
}
