import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  AlertCircle, 
  User, 
  Phone, 
  Calendar,
  FileText,
  Package,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  PlayCircle
} from 'lucide-react';
import { Prescription, PrescriptionStatus, updatePrescriptionStatus } from '@/services/prescriptionService';

interface PrescriptionDetailModalProps {
  prescription: Prescription | null;
  open: boolean;
  onClose: () => void;
  onStatusUpdate: (updatedPrescription: Prescription) => void;
}

export const PrescriptionDetailModal: React.FC<PrescriptionDetailModalProps> = ({
  prescription,
  open,
  onClose,
  onStatusUpdate,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取状态显示信息
  const getStatusInfo = (status: PrescriptionStatus) => {
    switch (status) {
      case 'pending':
        return { label: '待处理', color: 'bg-yellow-100 text-yellow-700', icon: Clock };
      case 'processing':
        return { label: '处理中', color: 'bg-blue-100 text-blue-700', icon: PlayCircle };
      case 'completed':
        return { label: '已完成', color: 'bg-green-100 text-green-700', icon: CheckCircle2 };
      case 'cancelled':
        return { label: '已取消', color: 'bg-red-100 text-red-700', icon: XCircle };
      default:
        return { label: '未知', color: 'bg-gray-100 text-gray-700', icon: AlertCircle };
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  // 处理状态更新
  const handleStatusUpdate = async (newStatus: PrescriptionStatus) => {
    if (!prescription) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedPrescription = await updatePrescriptionStatus(
        prescription.id, 
        newStatus,
        'pharmacy_001' // 模拟当前药房ID
      );
      onStatusUpdate(updatedPrescription);
      onClose();
    } catch (err) {
      console.error('更新处方状态失败:', err);
      setError(err instanceof Error ? err.message : '更新状态失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理Modal关闭
  const handleClose = () => {
    if (!isLoading) {
      setError(null);
      onClose();
    }
  };

  if (!prescription) return null;

  const statusInfo = getStatusInfo(prescription.status);
  const StatusIcon = statusInfo.icon;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            处方详情 - {prescription.id}
          </DialogTitle>
          <DialogDescription>
            查看处方详细信息并管理处理状态
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* 处方状态 */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">处方状态:</span>
            <Badge className={`${statusInfo.color} flex items-center gap-1`}>
              <StatusIcon className="h-3 w-3" />
              {statusInfo.label}
            </Badge>
          </div>

          <Separator />

          {/* 患者信息 - REMOVED: API v3.3 privacy compliance
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">患者信息</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">患者姓名</p>
                  <p className="text-sm font-medium">{prescription.patientName}</p>
                </div>
              </div>

              {prescription.patientPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">联系电话</p>
                    <p className="text-sm font-medium">{prescription.patientPhone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />
          */}

          {/* 医生信息 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">医生信息</h3>
            
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">开方医生</p>
                <p className="text-sm font-medium">{prescription.doctorName}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* 药品清单 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">药品清单</h3>
            
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">药品名称</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-700">用量</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-700">单价</th>
                    <th className="px-3 py-2 text-right font-medium text-gray-700">小计</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {prescription.items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium">{item.medicineName}</td>
                      <td className="px-3 py-2 text-center">{item.quantity} {item.unit}</td>
                      <td className="px-3 py-2 text-center">¥{item.pricePerUnit.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right">¥{item.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">帖数: {prescription.copies} 帖</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">总金额: ¥{prescription.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* 用法用量 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">用法用量</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">{prescription.instructions}</p>
            </div>
          </div>

          <Separator />

          {/* 时间信息 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">时间信息</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">创建时间</p>
                  <p className="text-sm font-medium">{formatDate(prescription.createdAt)}</p>
                </div>
              </div>

              {prescription.processedAt && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">开始处理时间</p>
                    <p className="text-sm font-medium">{formatDate(prescription.processedAt)}</p>
                  </div>
                </div>
              )}

              {prescription.completedAt && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">完成时间</p>
                    <p className="text-sm font-medium">{formatDate(prescription.completedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            关闭
          </Button>
          
          {/* 状态操作按钮 */}
          {prescription.status === 'pending' && (
            <Button 
              onClick={() => handleStatusUpdate('processing')} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              开始处理
            </Button>
          )}
          
          {prescription.status === 'processing' && (
            <Button 
              onClick={() => handleStatusUpdate('completed')} 
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              标记完成
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 