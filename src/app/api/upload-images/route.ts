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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { files } = body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { error: 'Không có thông tin file nào' },
        { status: 400 }
      );
    }

    if (files.length > 5) {
      return NextResponse.json(
        { error: 'Tối đa 5 ảnh được phép upload' },
        { status: 400 }
      );
    }

    const presignedUrls = await Promise.all(
      files.map(async (fileInfo: { name: string; type: string; size: number }) => {
        // Validate file type
        if (!fileInfo.type.startsWith('image/')) {
          throw new Error(`File ${fileInfo.name} không phải là ảnh`);
        }

        // Validate file size (5MB limit)
        if (fileInfo.size > 5 * 1024 * 1024) {
          throw new Error(`File ${fileInfo.name} quá lớn (tối đa 5MB)`);
        }

        const key = `uploads/images/${Date.now()}_${Math.random().toString(36).substring(2)}_${fileInfo.name}`;
        
        const command = new PutObjectCommand({
          Bucket: process.env.CLOUD_BUCKET_NAME!,
          Key: key,
          ContentType: fileInfo.type,
          ACL: 'public-read',
        });

        const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 360 });
        const publicUrl = `${process.env.CLOUD_ENDPOINT}/${process.env.CLOUD_BUCKET_NAME}/${key}`;
        
        return {
          originalName: fileInfo.name,
          key,
          presignedUrl,
          publicUrl,
          type: fileInfo.type,
          size: fileInfo.size
        };
      })
    );

    return NextResponse.json({
      success: true,
      presignedUrls,
      message: `Đã tạo thành công ${presignedUrls.length} presigned URL`
    });

  } catch (error: unknown) {
    console.error('Presign error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
    
    return NextResponse.json(
      { error: `Lỗi tạo presigned URL: ${errorMessage}` },
      { status: 500 }
    );
  }
}

 