
export default [
  {
    role: "khachhang",
    resources: [
      {
        resource: "taikhoan",
        permissions: ["canhan"]
      },
      {
        resource: "khachhang",
        permissions: ["dangky", "canhan"]
      },
      {
        resource: "sanpham",
        permissions: ["search", "soluong"]
      }
    ]
  },
  {
    role: "phucvu",
    resources: [
      "phieubanhang",
      "khachhang",
      {
        resource: "taikhoan",
        permissions: ["canhan"]
      },
      {
        resource: "nhanvien",
        permissions: ["canhan"]
      },
      {
        resource: "nhacungcap",
        permissions: ["search", "soluong"] 
      },
      {
        resource: "sanpham",
        permissions: ["search", "soluong"]
      }
    ]
  },
  {
    role: "quanlykho",
    resources: [
      {
        resource: "taikhoan",
        permissions: ["canhan"]
      },
      {
        resource: "nhanvien",
        permissions: ["canhan"]
      },
      "phieunhapkho", 
      "nhacungcap",
      "sanpham"
    ]
  },
  {
    role: "quanlynhansu",
    resources: [
      "khachhang",
      "nhanvien", 
      "taikhoan"
    ]
  },
  {
    role: "giamdoc",
    resources: [
      "nhanvien", 
      "sanpham", 
      "khachhang", 
      "taikhoan", 
      "canhan", 
      "nhacungcap",
      "phieubanhang",
      "phieunhapkho"
    ]
  },
  {
    role: "visitor",
    resources: [
      {
        resource: "sanpham",
        permissions: ["search", "soluong"]
      }
    ]
  },
]