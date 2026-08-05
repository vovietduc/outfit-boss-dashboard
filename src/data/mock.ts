export const vnd = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);

export const revenueByMonth = [
  { thang: "T1", doanhThu: 320, donHang: 210 },
  { thang: "T2", doanhThu: 285, donHang: 190 },
  { thang: "T3", doanhThu: 410, donHang: 265 },
  { thang: "T4", doanhThu: 385, donHang: 248 },
  { thang: "T5", doanhThu: 520, donHang: 331 },
  { thang: "T6", doanhThu: 610, donHang: 402 },
  { thang: "T7", doanhThu: 575, donHang: 366 },
  { thang: "T8", doanhThu: 720, donHang: 455 },
];

export const categoryShare = [
  { name: "Áo thun", value: 34 },
  { name: "Sơ mi", value: 24 },
  { name: "Quần jeans", value: 21 },
  { name: "Đầm & váy", value: 13 },
  { name: "Phụ kiện", value: 8 },
];

export type OrderStatus = "Chờ xác nhận" | "Đang giao" | "Hoàn tất" | "Đã huỷ";

export const orders: {
  id: string;
  khach: string;
  sanPham: string;
  soLuong: number;
  tong: number;
  trangThai: OrderStatus;
  ngay: string;
}[] = [
  { id: "#DH-10482", khach: "Nguyễn Minh Anh", sanPham: "Áo sơ mi linen trắng", soLuong: 2, tong: 890000, trangThai: "Chờ xác nhận", ngay: "05/08" },
  { id: "#DH-10481", khach: "Trần Quốc Bảo", sanPham: "Quần jeans slim xanh", soLuong: 1, tong: 650000, trangThai: "Đang giao", ngay: "05/08" },
  { id: "#DH-10480", khach: "Lê Thu Hà", sanPham: "Đầm midi hoa nhí", soLuong: 1, tong: 720000, trangThai: "Hoàn tất", ngay: "04/08" },
  { id: "#DH-10479", khach: "Phạm Gia Huy", sanPham: "Áo thun cotton basic", soLuong: 4, tong: 1160000, trangThai: "Hoàn tất", ngay: "04/08" },
  { id: "#DH-10478", khach: "Đỗ Khánh Linh", sanPham: "Chân váy xếp ly", soLuong: 1, tong: 480000, trangThai: "Đã huỷ", ngay: "03/08" },
  { id: "#DH-10477", khach: "Vũ Hoàng Nam", sanPham: "Áo khoác bomber", soLuong: 1, tong: 1290000, trangThai: "Đang giao", ngay: "03/08" },
  { id: "#DH-10476", khach: "Bùi Thanh Trúc", sanPham: "Set áo croptop + quần", soLuong: 2, tong: 1540000, trangThai: "Hoàn tất", ngay: "02/08" },
];

export const products = [
  { id: "SP-001", ten: "Áo sơ mi linen trắng", danhMuc: "Sơ mi", gia: 445000, ton: 128, daBan: 342, mau: ["Trắng", "Be"] },
  { id: "SP-002", ten: "Quần jeans slim xanh", danhMuc: "Quần jeans", gia: 650000, ton: 46, daBan: 289, mau: ["Xanh đậm"] },
  { id: "SP-003", ten: "Đầm midi hoa nhí", danhMuc: "Đầm & váy", gia: 720000, ton: 12, daBan: 176, mau: ["Hoa nhí", "Đen"] },
  { id: "SP-004", ten: "Áo thun cotton basic", danhMuc: "Áo thun", gia: 290000, ton: 380, daBan: 921, mau: ["Trắng", "Đen", "Xám"] },
  { id: "SP-005", ten: "Áo khoác bomber", danhMuc: "Áo khoác", gia: 1290000, ton: 8, daBan: 94, mau: ["Rêu", "Đen"] },
  { id: "SP-006", ten: "Chân váy xếp ly", danhMuc: "Đầm & váy", gia: 480000, ton: 63, daBan: 155, mau: ["Kem", "Nâu"] },
];

export const customers = [
  { ten: "Nguyễn Minh Anh", email: "minhanh@gmail.com", donHang: 14, chiTieu: 8420000, hang: "Kim cương" },
  { ten: "Bùi Thanh Trúc", email: "thanhtruc@gmail.com", donHang: 11, chiTieu: 6180000, hang: "Vàng" },
  { ten: "Trần Quốc Bảo", email: "quocbao@gmail.com", donHang: 9, chiTieu: 4750000, hang: "Vàng" },
  { ten: "Lê Thu Hà", email: "thuha@gmail.com", donHang: 6, chiTieu: 3120000, hang: "Bạc" },
  { ten: "Phạm Gia Huy", email: "giahuy@gmail.com", donHang: 4, chiTieu: 1980000, hang: "Bạc" },
];
