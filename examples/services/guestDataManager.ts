/**
 * 🔄 代码复用资产 - Guest模式数据管理器
 * 原项目: B2B2C中医处方履约平台
 * 复用等级: 一级复用 (直接迁移)
 * 适配要求: 适配Supabase匿名认证和本地存储
 * 测试状态: 已通过完整功能测试和数据一致性测试
 * 
 * @deprecated 需要适配Supabase架构后使用
 * @migration 迁移到Supabase-First架构
 * @guest_mode 支持Supabase匿名认证
 * @local_storage 与Supabase本地缓存集成
 * @data_migration Guest到正式用户的数据迁移
 */

/**
 * 药品项目接口 - 匹配后端API格式
 */
export interface MedicineItem {
  /** 药品ID */
  id: string;
  /** 药品名称 */
  name: string;
  /** 用量（克） */
  quantity: number;
  /** 单价（元/克） */
  pricePerGram: number;
  /** 小计（元） */
  subtotal: number;
}

/**
 * 本地处方接口 - 完全匹配后端PrescriptionResponse格式
 */
export interface LocalPrescription {
  /** 处方ID（自动生成） */
  id: string;
  /** 药品列表 */
  medicines: MedicineItem[];
  /** 用法用量说明 */
  instructions: string;
  /** 帖数 */
  dosage: number;
  /** 总价（元） */
  totalAmount: number;
  /** 创建时间（ISO 8601格式） */
  createdAt: string;
  /** 演示数据标识 */
  isDemo: true;
}

/**
 * 处方保存数据类型（排除自动生成字段）
 */
export type PrescriptionSaveData = Omit<LocalPrescription, 'id' | 'createdAt' | 'isDemo'>;

/**
 * Guest Data Manager 类
 * 
 * @description 管理Guest模式下的临时处方数据
 * @features 
 * - 零localStorage：完全基于内存存储
 * - API兼容：符合后端PrescriptionResponse格式  
 * - 类型安全：完整TypeScript类型支持
 * - 手动控制：支持导出后手动清空
 * - 便利方法：getCount() 和 hasData() 用于状态检查
 */
export class GuestDataManager {
  /** 内存中的临时处方存储 */
  private tempPrescriptions: LocalPrescription[] = [];

  /**
   * 保存处方到内存
   * 
   * @param prescriptionData 处方数据（不包含id、createdAt、isDemo）
   * @returns 完整的本地处方对象
   */
  savePrescription(prescriptionData: PrescriptionSaveData): LocalPrescription {
    const prescription: LocalPrescription = {
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      isDemo: true,
      ...prescriptionData
    };

    this.tempPrescriptions.push(prescription);
    return prescription;
  }

  /**
   * 获取所有保存的处方
   * 
   * @returns 处方列表的不可变副本
   */
  getPrescriptions(): LocalPrescription[] {
    return [...this.tempPrescriptions];
  }

  /**
   * 清空所有处方
   */
  clearPrescriptions(): void {
    this.tempPrescriptions = [];
  }

  /**
   * 导出后手动清空
   * 
   * @description 与clearPrescriptions功能相同，提供语义化的导出后清空操作
   */
  clearAfterExport(): void {
    this.clearPrescriptions();
  }

  /**
   * 生成唯一ID
   * 
   * @returns 基于时间戳和随机数的唯一ID，确保Guest模式下的数据可识别
   * @private
   */
  private generateId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return `guest_${timestamp}_${random}`;
  }

  /**
   * 获取存储的处方数量
   * 
   * @returns 当前内存中处方的数量
   */
  getCount(): number {
    return this.tempPrescriptions.length;
  }

  /**
   * 检查是否有保存的处方
   * 
   * @returns 是否有处方数据
   */
  hasData(): boolean {
    return this.tempPrescriptions.length > 0;
  }
}