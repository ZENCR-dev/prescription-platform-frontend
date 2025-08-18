/**
 * 🔄 代码复用资产 - QR码解析器
 * 原项目: B2B2C中医处方履约平台
 * 复用等级: 一级复用 (直接迁移)
 * 适配要求: 无需修改，直接复用
 * 测试状态: 已通过完整单元测试和解析测试
 * 
 * @deprecated 无需修改，直接使用
 * @migration 直接复用到新项目
 * @business_logic 纯工具函数，无架构依赖
 * @qr_parser QR码解析和数据验证
 */

import { z } from 'zod';
import { PrescriptionQRData, QRParseResult, PrescriptionQRItem } from '@/types/prescription';

/**
 * QR码数据验证Schema
 */
const PrescriptionQRItemSchema = z.object({
  id: z.string().min(1, '药品ID不能为空'),
  name: z.string().min(1, '药品名称不能为空').optional(),
  quantity: z.number().positive('用量必须大于0')
});

const PrescriptionQRDataSchema = z.object({
  prescriptionId: z.string().min(1, '处方ID不能为空'),
  items: z.array(PrescriptionQRItemSchema).min(1, '处方必须包含至少一个药品'),
  copies: z.number().int().positive('帖数必须为正整数'),
  instructions: z.string().min(1, '用法说明不能为空')
});

/**
 * 解析QR码文本内容
 * @param qrText - QR码扫描得到的原始文本
 * @returns 解析结果，包含成功标志、数据或错误信息
 */
export function parseQrText(qrText: string): QRParseResult {
  // 1. 基础验证
  if (typeof qrText !== 'string') {
    return {
      success: false,
      error: '无效的QR码内容',
      errorType: 'INVALID_FORMAT'
    };
  }

  const trimmedText = qrText.trim();
  if (trimmedText.length === 0) {
    return {
      success: false,
      error: 'QR码内容为空',
      errorType: 'INVALID_FORMAT'
    };
  }

  try {
    // 2. JSON解析
    let parsedData: unknown;
    try {
      parsedData = JSON.parse(trimmedText);
    } catch (jsonError) {
      return {
        success: false,
        error: '无法解析QR码内容：格式不是有效的JSON',
        errorType: 'INVALID_JSON'
      };
    }

    // 3. 数据结构验证
    const validationResult = PrescriptionQRDataSchema.safeParse(parsedData);
    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.map(err => err.message);
      return {
        success: false,
        error: `处方数据格式错误: ${errorMessages.join(', ')}`,
        errorType: 'INVALID_FORMAT'
      };
    }

    const prescriptionData = validationResult.data;

    // 4. 业务逻辑验证
    const businessValidation = validateBusinessRules(prescriptionData);
    if (!businessValidation.isValid) {
      return {
        success: false,
        error: businessValidation.error,
        errorType: 'INVALID_DATA'
      };
    }

    // 5. 成功返回
    return {
      success: true,
      data: prescriptionData
    };

  } catch (error) {
    console.error('[QR Parser] Unexpected error:', error);
    return {
      success: false,
      error: '解析过程中发生未知错误',
      errorType: 'INVALID_FORMAT'
    };
  }
}

/**
 * 业务规则验证
 * @param data - 已通过schema验证的数据
 * @returns 验证结果
 */
function validateBusinessRules(data: PrescriptionQRData): { isValid: boolean; error?: string } {
  // 验证帖数范围
  if (data.copies > 30) {
    return {
      isValid: false,
      error: '帖数不能超过30帖'
    };
  }

  // 验证药品用量范围
  for (const item of data.items) {
    if (item.quantity > 1000) {
      return {
        isValid: false,
        error: `药品"${item.name || item.id}"用量过大（超过1000克）`
      };
    }
    if (item.quantity < 0.1) {
      return {
        isValid: false,
        error: `药品"${item.name || item.id}"用量过小（少于0.1克）`
      };
    }
  }

  // 验证药品数量
  if (data.items.length > 50) {
    return {
      isValid: false,
      error: '单个处方药品种类不能超过50种'
    };
  }

  // 验证用法说明长度
  if (data.instructions.length > 500) {
    return {
      isValid: false,
      error: '用法说明过长（超过500字符）'
    };
  }

  return { isValid: true };
}

/**
 * 验证QR码文本是否可能是处方数据
 * 用于快速预检查，避免不必要的完整解析
 * @param qrText - QR码文本
 * @returns 是否可能是处方QR码
 */
export function isPossiblePrescriptionQR(qrText: string): boolean {
  if (!qrText || typeof qrText !== 'string') {
    return false;
  }

  const trimmed = qrText.trim();
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) {
    return false;
  }

  // 快速检查是否包含预期的关键字段
  return trimmed.includes('"prescriptionId"') &&
         trimmed.includes('"items"') && 
         trimmed.includes('"copies"') && 
         trimmed.includes('"instructions"');
}

/**
 * 创建示例处方QR码数据（用于测试）
 * @returns 示例处方数据
 */
export function createSamplePrescriptionQR(): PrescriptionQRData {
  return {
    prescriptionId: "RX20240528001", // 示例处方ID
    items: [
      {
        id: "med_001",
        quantity: 15
      },
      {
        id: "med_002", 
        quantity: 12
      }
    ],
    copies: 7,
    instructions: "每日1剂，水煎服，早晚各1次，饭后温服"
  };
}

/**
 * 将处方数据转换为QR码字符串（主要用于测试）
 * @param data - 处方数据
 * @returns QR码字符串
 */
export function prescriptionDataToQRString(data: PrescriptionQRData): string {
  return JSON.stringify(data);
} 