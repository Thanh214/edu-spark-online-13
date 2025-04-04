
#!/bin/bash

# Đảm bảo script chạy từ thư mục server
cd "$(dirname "$0")"

# Chạy script seed dữ liệu
echo "Chạy seed dữ liệu..."
npx ts-node src/utils/sampleData.ts

echo "Hoàn thành!"
