export const mockDashboardStats = {
    studentCount: 100,
    scoreAverage: 85,
    pendingComplaints: 5,
}

export const mockStudents = [
    {
        MaSV: "N22DCVT076",
        Ho: "Nguyễn Văn",
        Ten: "Quang",
        NgaySinh: "2004-04-18",
        GioiTinh: 1,
        SoDienThoai: "0123456789",
        EmailTruong: "nvq@student.ptithcm.edu.vn",
        MaCN: "CNPM",
        MaLop: "E22CQCN02",
    },
    {
        MaSV: "N22DCVT093",
        Ho: "Hàng Gia",
        Ten: "Thịnh",
        NgaySinh: "2004-02-17",
        GioiTinh: 1,
        SoDienThoai: "9876543210",
        EmailTruong: "hgt@student.ptithcm.edu.vn",
        MaCN: "CNPM",
        MaLop: "E22CQCN02",
    },
]

export const mockScores = [
    {
        IdDRL: 1,
        IdHK: 1,
        MaSV: "N22DCVT076",
        ThoiGianBatDau: "2024-12-01",
        ThoiGianKetThuc: "2024-12-15",
        NgaySVCham: "2024-12-03",
        IdBCS: 1,
        NgayBCSCham: "2024-12-10",
        IdCVHT: 1,
        NgayCVHTCham: "2024-12-12",
        TongDiem: 91,
        ChiTiet: [
            { IdND: 1, TieuChi: "1.1", NoiDung: "Ý thức và thái độ trong học tập", MaxDiem: 3, DiemSV: 3, DiemBCS: 3, DiemCVHT: 3 },
            { IdND: 2, TieuChi: "1.2", NoiDung: "Kết quả học tập (Giỏi)", MaxDiem: 8, DiemSV: 8, DiemBCS: 8, DiemCVHT: 8 },
            { IdND: 3, TieuChi: "1.3", NoiDung: "Ý thức chấp hành nội quy kỳ thi", MaxDiem: 4, DiemSV: 4, DiemBCS: 4, DiemCVHT: 4 },
            { IdND: 4, TieuChi: "1.4", NoiDung: "Tham gia hoạt động ngoại khóa", MaxDiem: 2, DiemSV: 2, DiemBCS: 2, DiemCVHT: 2 },
            { IdND: 5, TieuChi: "1.5", NoiDung: "Tinh thần vượt khó", MaxDiem: 1, DiemSV: 1, DiemBCS: 1, DiemCVHT: 1 },
            { IdND: 6, TieuChi: "2.1", NoiDung: "Thực hiện nội quy Học viện", MaxDiem: 15, DiemSV: 15, DiemBCS: 15, DiemCVHT: 15 },
            { IdND: 7, TieuChi: "2.2", NoiDung: "Tham gia họp lớp/sinh hoạt đoàn thể", MaxDiem: 5, DiemSV: 5, DiemBCS: 5, DiemCVHT: 5 },
            { IdND: 8, TieuChi: "2.3", NoiDung: "Tham gia hội thảo việc làm", MaxDiem: 5, DiemSV: 5, DiemBCS: 5, DiemCVHT: 5 },
            { IdND: 9, TieuChi: "3.1", NoiDung: "Tham gia hoạt động chính trị, xã hội", MaxDiem: 10, DiemSV: 10, DiemBCS: 10, DiemCVHT: 10 },
            { IdND: 10, TieuChi: "3.2", NoiDung: "Tham gia công tác xã hội", MaxDiem: 4, DiemSV: 4, DiemBCS: 4, DiemCVHT: 4 },
            { IdND: 11, TieuChi: "3.3", NoiDung: "Tuyên truyền hình ảnh Trường", MaxDiem: 3, DiemSV: 3, DiemBCS: 3, DiemCVHT: 3 },
            { IdND: 12, TieuChi: "3.4", NoiDung: "Phòng chống tội phạm, tệ nạn", MaxDiem: 3, DiemSV: 3, DiemBCS: 3, DiemCVHT: 3 },
            { IdND: 13, TieuChi: "4.1", NoiDung: "Chấp hành pháp luật", MaxDiem: 8, DiemSV: 8, DiemBCS: 8, DiemCVHT: 8 },
            { IdND: 14, TieuChi: "4.2", NoiDung: "Tuyên truyền pháp luật, vệ sinh", MaxDiem: 5, DiemSV: 5, DiemBCS: 5, DiemCVHT: 5 },
            { IdND: 15, TieuChi: "4.3", NoiDung: "Quan hệ với Thầy/Cô", MaxDiem: 5, DiemSV: 5, DiemBCS: 5, DiemCVHT: 5 },
            { IdND: 16, TieuChi: "4.4", NoiDung: "Quan hệ với bạn bè", MaxDiem: 5, DiemSV: 5, DiemBCS: 5, DiemCVHT: 5 },
            { IdND: 17, TieuChi: "4.5", NoiDung: "Được khen thưởng", MaxDiem: 2, DiemSV: 2, DiemBCS: 2, DiemCVHT: 2 },
            { IdND: 18, TieuChi: "5.1", NoiDung: "Phụ trách lớp, đoàn thể", MaxDiem: 4, DiemSV: 4, DiemBCS: 4, DiemCVHT: 4 },
            { IdND: 19, TieuChi: "5.2", NoiDung: "Thành viên CLB/đội nhóm", MaxDiem: 3, DiemSV: 3, DiemBCS: 3, DiemCVHT: 3 },
            { IdND: 20, TieuChi: "5.3", NoiDung: "Thành tích đặc biệt", MaxDiem: 3, DiemSV: 3, DiemBCS: 3, DiemCVHT: 3 },
        ],
    },
]

export const mockComplaints = [
    {
        IdKhieuNai: "1",
        NoiDung: "Khiếu nại điểm rèn luyện học kỳ 1",
        NgayGui: "2024-12-10",
        TrangThai: "Chưa xử lý",
        IdDon: 1,
        MaSV: "N22DCVT076",
        IdNVPB: 1,
    },
]


export const mockUser = {
    MaSV: "N22DCVT076",
    Ho: "Nguyễn Văn",
    Ten: "Quang",
    NgaySinh: "2004-04-18",
    GioiTinh: 1,
    SoDienThoai: "0123456789",
    EmailTruong: "nvq@student.ptithcm.edu.vn",
    MaCN: "CNPM",
    MaLop: "E22CQCN02",
    TenDangNhap: "nvquang",
    Quyen: "SinhVien",
}

export const mockScoreForm = {
    IdDRL: 3,
    IdHK: 1,
    MaSV: "N22DCVT076",
    ThoiGianBatDau: "2024-12-01",
    ThoiGianKetThuc: "2024-12-15",
    ChiTiet: [
        { IdND: 1, TieuChi: "1.1", NoiDung: "Ý thức và thái độ trong học tập", MaxDiem: 3, DiemSV: null },
        { IdND: 2, TieuChi: "1.2", NoiDung: "Kết quả học tập", MaxDiem: 10, DiemSV: null },
        { IdND: 3, TieuChi: "1.3", NoiDung: "Ý thức chấp hành nội quy kỳ thi", MaxDiem: 4, DiemSV: null },
        { IdND: 4, TieuChi: "1.4", NoiDung: "Tham gia hoạt động ngoại khóa", MaxDiem: 2, DiemSV: null },
        { IdND: 5, TieuChi: "1.5", NoiDung: "Tinh thần vượt khó", MaxDiem: 1, DiemSV: null },
        { IdND: 6, TieuChi: "2.1", NoiDung: "Thực hiện nội quy Học viện", MaxDiem: 15, DiemSV: null },
        { IdND: 7, TieuChi: "2.2", NoiDung: "Tham gia họp lớp/sinh hoạt đoàn thể", MaxDiem: 5, DiemSV: null },
        { IdND: 8, TieuChi: "2.3", NoiDung: "Tham gia hội thảo việc làm", MaxDiem: 5, DiemSV: null },
        { IdND: 9, TieuChi: "3.1", NoiDung: "Tham gia hoạt động chính trị, xã hội", MaxDiem: 10, DiemSV: null },
        { IdND: 10, TieuChi: "3.2", NoiDung: "Tham gia công tác xã hội", MaxDiem: 4, DiemSV: null },
        { IdND: 11, TieuChi: "3.3", NoiDung: "Tuyên truyền hình ảnh Trường", MaxDiem: 3, DiemSV: null },
        { IdND: 12, TieuChi: "3.4", NoiDung: "Phòng chống tội phạm, tệ nạn", MaxDiem: 3, DiemSV: null },
        { IdND: 13, TieuChi: "4.1", NoiDung: "Chấp hành pháp luật", MaxDiem: 8, DiemSV: null },
        { IdND: 14, TieuChi: "4.2", NoiDung: "Tuyên truyền pháp luật, vệ sinh", MaxDiem: 5, DiemSV: null },
        { IdND: 15, TieuChi: "4.3", NoiDung: "Quan hệ với Thầy/Cô", MaxDiem: 5, DiemSV: null },
        { IdND: 16, TieuChi: "4.4", NoiDung: "Quan hệ với bạn bè", MaxDiem: 5, DiemSV: null },
        { IdND: 17, TieuChi: "4.5", NoiDung: "Được khen thưởng", MaxDiem: 2, DiemSV: null },
        { IdND: 18, TieuChi: "5.1", NoiDung: "Phụ trách lớp, đoàn thể", MaxDiem: 4, DiemSV: null },
        { IdND: 19, TieuChi: "5.2", NoiDung: "Thành viên CLB/đội nhóm", MaxDiem: 3, DiemSV: null },
        { IdND: 20, TieuChi: "5.3", NoiDung: "Thành tích đặc biệt", MaxDiem: 3, DiemSV: null },
    ],
}

export const mockUsers = [
    {
        username: "admin",
        password: "123456",
        role: "NhanVienCTSV",
        info: { MaNV: "NV001", HoTen: "Nguyễn Văn A", Quyen: "NhanVienCTSV" },
    },
    {
        username: "khoa",
        password: "123456",
        role: "NhanVienKhoa",
        info: { MaNV: "NV002", HoTen: "Trần Thị B", Quyen: "NhanVienKhoa" },
    },
    {
        username: "cvht",
        password: "123456",
        role: "GiangVien",
        info: { MaGV: "GV001", HoTen: "Lê Văn C", Quyen: "GiangVien" },
    },
    {
        username: "bcs",
        password: "123456",
        role: "BanCanSu",
        info: { MaSV: "N22DCVT093", HoTen: "Hàng Gia Thịnh", Quyen: "BanCanSu" },
    },
    {
        username: "sinhvien",
        password: "123456",
        role: "SinhVien",
        info: { MaSV: "N22DCVT076", HoTen: "Nguyễn Văn Quang", Quyen: "SinhVien" },
    },


]

export const mockNotifications = [
    {
        IdTB: 1,
        TieuDe: "Chấm điểm rèn luyện học kỳ 1 2024-2025",
        NoiDung: "Kế hoạch chấm điểm từ 01/12/2024 đến 15/12/2024.",
        NgayGui: "2024-12-01T12:00:00Z",
        MaNV: "NV001",
    },
    {
        IdTB: 2,
        TieuDe: "Thông báo đóng học phí",
        NoiDung: "Hạn chót đóng học phí kỳ 1 năm 2024-2025 là 15/12/2024.",
        NgayGui: "2024-11-25T09:00:00Z",
        MaNV: "NV002",
    },
    // Thêm các thông báo khác nếu cần
]