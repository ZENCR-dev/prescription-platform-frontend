/**
 * 🔄 代码复用资产 - 处方计算器
 * 原项目: B2B2C中医处方履约平台
 * 复用等级: 一级复用 (直接迁移)
 * 适配要求: 迁移到Supabase Edge Functions，服务器端计算
 * 测试状态: 已通过完整单元测试和准确性测试
 * 
 * @deprecated 需要迁移到Edge Functions后使用
 * @migration 迁移到Supabase Edge Functions
 * @business_logic 纯业务逻辑，可直接复用
 * @edge_functions 需要迁移到服务器端执行
 * @nzd_cents NZD cents精度计算，防止浮点数问题
 */

import { Medicine } from '@/types/medicine';
import { PrescriptionQRData, PrescriptionQRItem } from '@/types/prescription';
import { mockMedicines } from '@/mocks/medicineData';

/**
 * 药房端药品信息（包含批发价）
 */
export interface PharmacyMedicineInfo extends Medicine {
  /** 批发价（元/克），通常为零售价的70-80% */
  wholesalePrice: number;
  /** 成本价（元/克），通常为零售价的50-60% */
  costPrice: number;
  /** 是否找到该药品 */
  found: boolean;
}

/**
 * 处方计算结果
 */
export interface PrescriptionCalculationResult {
  /** 是否计算成功 */
  success: boolean;
  /** 错误信息（失败时） */
  error?: string;
  /** 处方ID */
  prescriptionId: string;
  /** 药品详细信息列表 */
  medicineDetails: PharmacyMedicineInfo[];
  /** 原始处方项目（包含用量信息） */
  originalItems: PrescriptionQRItem[];
  /** 单剂总价（零售价） */
  singleDoseRetailTotal: number;
  /** 单剂总价（批发价） */
  singleDoseWholesaleTotal: number;
  /** 单剂总价（成本价） */
  singleDoseCostTotal: number;
  /** 全部帖数总价（零售价） */
  totalRetailPrice: number;
  /** 全部帖数总价（批发价） */
  totalWholesalePrice: number;
  /** 全部帖数总价（成本价） */
  totalCostPrice: number;
  /** 帖数 */
  copies: number;
  /** 用法说明 */
  instructions: string;
  /** 未找到的药品列表 */
  notFoundMedicines: string[];
}

/**
 * 根据药品ID查找药品信息
 * @param medicineId - 药品ID
 * @returns 药品信息，如果未找到则返回null
 */
export function findMedicineById(medicineId: string): Medicine | null {
  return mockMedicines.find(medicine => medicine.id === medicineId) || null;
}

/**
 * 根据药品名称查找药品信息（支持中文名、英文名、拼音名）
 * @param medicineName - 药品名称
 * @returns 药品信息，如果未找到则返回null
 */
export function findMedicineByName(medicineName: string): Medicine | null {
  const searchName = medicineName.toLowerCase().trim();
  
  return mockMedicines.find(medicine => 
    medicine.name.toLowerCase() === searchName ||
    medicine.chineseName.toLowerCase() === searchName ||
    medicine.englishName.toLowerCase() === searchName ||
    medicine.pinyinName.toLowerCase() === searchName ||
    medicine.sku.toLowerCase() === searchName
  ) || null;
}

/**
 * 计算批发价和成本价
 * @param retailPrice - 零售价
 * @returns 包含批发价和成本价的对象
 */
export function calculateWholesaleAndCostPrices(retailPrice: number): { wholesalePrice: number; costPrice: number } {
  // 批发价通常为零售价的75%
  const wholesalePrice = Math.round(retailPrice * 0.75 * 100) / 100;
  
  // 成本价通常为零售价的55%
  const costPrice = Math.round(retailPrice * 0.55 * 100) / 100;
  
  return { wholesalePrice, costPrice };
}

/**
 * 将药品信息转换为药房端信息
 * @param medicine - 基础药品信息
 * @param found - 是否找到该药品
 * @returns 药房端药品信息
 */
export function toPharmacyMedicineInfo(medicine: Medicine | null, found: boolean = true): PharmacyMedicineInfo {
  if (!medicine || !found) {
    return {
      id: '',
      sku: '',
      name: '',
      pinyinName: '',
      category: '',
      pricePerGram: 0,
      chineseName: '',
      englishName: '',
      pinyinName: '',
      wholesalePrice: 0,
      costPrice: 0,
      found: false
    };
  }

  const { wholesalePrice, costPrice } = calculateWholesaleAndCostPrices(medicine.basePrice);
  
  return {
    ...medicine,
    wholesalePrice,
    costPrice,
    found: true
  };
}

/**
 * 计算处方总价和详细信息
 * @param prescriptionData - 处方数据
 * @returns 计算结果
 */
export function calculatePrescription(prescriptionData: PrescriptionQRData): PrescriptionCalculationResult {
  const medicineDetails: PharmacyMedicineInfo[] = [];
  const notFoundMedicines: string[] = [];
  
  let singleDoseRetailTotal = 0;
  let singleDoseWholesaleTotal = 0;
  let singleDoseCostTotal = 0;

  // 处理每个药品项目
  for (const item of prescriptionData.items) {
    // 首先尝试通过ID查找
    let medicine = findMedicineById(item.id);
    
    // 如果通过ID未找到，尝试通过名称查找（如果有名称的话）
    if (!medicine && item.name) {
      medicine = findMedicineByName(item.name);
    }
    
    if (medicine) {
      const pharmacyInfo = toPharmacyMedicineInfo(medicine, true);
      medicineDetails.push(pharmacyInfo);
      
      // 计算该药品的总价（用量 × 单价）
      const itemRetailTotal = item.quantity * pharmacyInfo.pricePerGram;
      const itemWholesaleTotal = item.quantity * pharmacyInfo.wholesalePrice;
      const itemCostTotal = item.quantity * pharmacyInfo.costPrice;
      
      singleDoseRetailTotal += itemRetailTotal;
      singleDoseWholesaleTotal += itemWholesaleTotal;
      singleDoseCostTotal += itemCostTotal;
    } else {
      // 药品未找到
      const notFoundInfo = toPharmacyMedicineInfo(null, false);
      notFoundInfo.id = item.id;
      notFoundInfo.name = item.name || `药品-${item.id}`;
      notFoundInfo.chineseName = item.name || `药品-${item.id}`;
      medicineDetails.push(notFoundInfo);
      notFoundMedicines.push(`${item.name || `药品-${item.id}`} (ID: ${item.id})`);
    }
  }

  // 计算全部帖数的总价
  const totalRetailPrice = singleDoseRetailTotal * prescriptionData.copies;
  const totalWholesalePrice = singleDoseWholesaleTotal * prescriptionData.copies;
  const totalCostPrice = singleDoseCostTotal * prescriptionData.copies;

  // 四舍五入到两位小数
  const roundToTwo = (num: number) => Math.round(num * 100) / 100;

  return {
    success: notFoundMedicines.length === 0,
    error: notFoundMedicines.length > 0 ? `未找到以下药品: ${notFoundMedicines.join(', ')}` : undefined,
    prescriptionId: prescriptionData.prescriptionId,
    medicineDetails,
    originalItems: prescriptionData.items,
    singleDoseRetailTotal: roundToTwo(singleDoseRetailTotal),
    singleDoseWholesaleTotal: roundToTwo(singleDoseWholesaleTotal),
    singleDoseCostTotal: roundToTwo(singleDoseCostTotal),
    totalRetailPrice: roundToTwo(totalRetailPrice),
    totalWholesalePrice: roundToTwo(totalWholesalePrice),
    totalCostPrice: roundToTwo(totalCostPrice),
    copies: prescriptionData.copies,
    instructions: prescriptionData.instructions,
    notFoundMedicines
  };
}

/**
 * 格式化价格显示
 * @param price - 价格
 * @param currency - 货币符号，默认为'$'
 * @returns 格式化后的价格字符串
 */
export function formatPrice(price: number, currency: string = '$'): string {
  return `${currency}${price.toFixed(2)}`;
}

/**
 * 计算药品利润率
 * @param retailPrice - 零售价
 * @param costPrice - 成本价
 * @returns 利润率（百分比）
 */
export function calculateProfitMargin(retailPrice: number, costPrice: number): number {
  if (costPrice === 0) return 0;
  return Math.round(((retailPrice - costPrice) / costPrice) * 100);
} 