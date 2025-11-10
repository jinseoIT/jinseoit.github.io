import fs from "fs";
import path from "path";

const today = new Date().toISOString();
const formattedDate = today.split("T")[0];
const baseSlug = "temp";
const baseName = `${formattedDate}-${baseSlug}`;
const dir = path.resolve("./src/content/posts");

// 폴더 없으면 생성
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// 중복 검사 및 번호 붙이기
let filename = `${baseName}.md`;
let count = 1;
while (fs.existsSync(path.join(dir, filename))) {
  filename = `${baseName}${count}.md`;
  count += 1;
}

const filepath = path.join(dir, filename);

const frontmatter = `---
title: "Temp"
description: "Temp"
author: "Temp"
image: "/blog-placeholder-1.jpg"
published: ${today}
tags: []
---

여기에 본문을 작성하세요.
`;

fs.writeFileSync(filepath, frontmatter);
console.log(`✅ 새 글이 생성되었습니다: ${filepath}`);
