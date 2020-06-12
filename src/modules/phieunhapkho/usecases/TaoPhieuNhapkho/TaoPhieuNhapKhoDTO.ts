import TaoCTPhieuNKDTO from "./TaoCTPhieuNKDTO";


export default interface TaoPhieuNhapKhoDTO {
  nv_id: string;
  nhacc_id: string;
  loai_phieu: number;
  ds_ctphieu: TaoCTPhieuNKDTO[];
}
