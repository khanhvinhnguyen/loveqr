import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { tmpdir } from "os";
import { mkdtemp, writeFile, unlink, readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const qrFile = form.get("qr") as File | null;
  const bgFile = form.get("bg") as File | null;
  const sizeStr = form.get("size") as string | null;

  if (!qrFile || !bgFile) {
    return NextResponse.json({ error: "Need qr & bg files" }, { status: 400 });
  }

  const dir = await mkdtemp(path.join(tmpdir(), "qrmerge-"));
  const qrPath = path.join(dir, "qr.png");
  const bgPath = path.join(dir, "bg");
  const outPath = path.join(dir, "out.png");

  await Promise.all([
    writeFile(qrPath, Buffer.from(await qrFile.arrayBuffer())),
    writeFile(bgPath, Buffer.from(await bgFile.arrayBuffer())),
  ]);

  const pyArgs = [
    path.join(process.cwd(), "scripts", "merge_qr_bg.py"),
    qrPath,
    bgPath,
    outPath,
  ];
  if (sizeStr) pyArgs.push(sizeStr);

  const py = spawn("python3", pyArgs);

  const errBuf: Buffer[] = [];
  py.stderr.on("data", (d) => errBuf.push(d));

  const exitCode: number = await new Promise((res) =>
    py.on("close", res)
  );

  if (exitCode !== 0) {
    return NextResponse.json(
      { error: Buffer.concat(errBuf).toString() },
      { status: 500 }
    );
  }

  const out = await readFile(outPath);

  // dọn rác (không cần đợi)
  unlink(qrPath).catch(() => {});
  unlink(bgPath).catch(() => {});
  unlink(outPath).catch(() => {});

  return new NextResponse(out, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": "attachment; filename=\"square_qr.png\"",
    },
  });
}
