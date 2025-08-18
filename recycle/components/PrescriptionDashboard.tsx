'use client';

/**
 * 🔄 代码复用资产 - 处方管理仪表盘
 * 原项目: B2B2C中医处方履约平台
 * 复用等级: 二级复用 (需要实时订阅适配)
 * 适配要求: 适配Supabase实时订阅和RLS策略
 * 测试状态: 已通过完整功能测试和性能测试
 * 
 * @deprecated 需要适配Supabase架构后使用
 * @migration 迁移到Supabase-First架构
 * @realtime_integration 需要适配Supabase Realtime订阅
 * @rls_policy 需要集成RLS策略数据过滤
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  DollarSign,
  Activity
} from 'lucide-react';

import { PrescriptionStatus } from '@/types/prescription';
import { useAuth } from '@/hooks/useAuth';
import { getPrescriptionStats } from '@/services/prescriptionService';
import { PrescriptionCreator } from './PrescriptionCreator';
import { PrescriptionListManager } from './PrescriptionListManager';

export function PrescriptionDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPrescriptions: 0,
    statusBreakdown: {} as Record<PrescriptionStatus, number>,
    totalValue: 0,
    avgPrescriptionValue: 0,
    topMedicines: [] as Array<{
      medicineId: string;
      medicineName: string;
      count: number;
      totalQuantity: number;
    }>
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // 加载统计数据
  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const statsData = await getPrescriptionStats(user?.id);
      setStats(statsData);
    } catch (error) {
      console.error('加载统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadStats();
  }, [user?.id, loadStats]);

  // 获取状态对应的颜色和图标
  const getStatusInfo = (status: PrescriptionStatus) => {
    switch (status) {
      case PrescriptionStatus.COMPLETED:
        return { color: 'green', icon: CheckCircle };
      case PrescriptionStatus.PROCESSING:
        return { color: 'orange', icon: Clock };
      case PrescriptionStatus.PENDING:
        return { color: 'yellow', icon: AlertCircle };
      case PrescriptionStatus.CANCELLED:
        return { color: 'red', icon: AlertCircle };
      default:
        return { color: 'gray', icon: FileText };
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">处方管理</h1>
          <p className="text-gray-600 mt-1">创建和管理您的中医处方</p>
        </div>
        <Button 
          size="lg"
          onClick={() => setActiveTab('create')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          创建新处方
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="all">全部处方</TabsTrigger>
          <TabsTrigger value="pending">待处理</TabsTrigger>
          <TabsTrigger value="create">创建处方</TabsTrigger>
        </TabsList>

        {/* 概览面板 */}
        <TabsContent value="overview" className="space-y-6">
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">总处方数</p>
                    <p className="text-3xl font-bold">{stats.totalPrescriptions}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">总价值</p>
                    <p className="text-3xl font-bold">¥{stats.totalValue.toFixed(0)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">平均处方价值</p>
                    <p className="text-3xl font-bold">¥{stats.avgPrescriptionValue.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">活跃处方</p>
                    <p className="text-3xl font-bold">
                      {(stats.statusBreakdown[PrescriptionStatus.PENDING] || 0) + 
                       (stats.statusBreakdown[PrescriptionStatus.PROCESSING] || 0)}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 状态分布 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>处方状态分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.statusBreakdown).map(([status, count]) => {
                    const { color, icon: Icon } = getStatusInfo(status as PrescriptionStatus);
                    const percentage = stats.totalPrescriptions > 0 
                      ? (count / stats.totalPrescriptions * 100).toFixed(1) 
                      : '0';
                    
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 text-${color}-600`} />
                          <span className="font-medium">
                            {status === 'draft' && '草稿'}
                            {status === 'pending' && '待确认'}
                            {status === 'confirmed' && '已确认'}
                            {status === 'processing' && '处理中'}
                            {status === 'completed' && '已完成'}
                            {status === 'cancelled' && '已取消'}
                            {status === 'expired' && '已过期'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{count}</Badge>
                          <span className="text-sm text-gray-500">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>常用药品</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.topMedicines.slice(0, 5).map((medicine, index) => (
                    <div key={medicine.medicineId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-medium">{medicine.medicineName}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{medicine.count}次</p>
                        <p className="text-sm text-gray-500">{medicine.totalQuantity}g</p>
                      </div>
                    </div>
                  ))}
                  {stats.topMedicines.length === 0 && (
                    <p className="text-center text-gray-500 py-4">暂无数据</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 快速操作 */}
          <Card>
            <CardHeader>
              <CardTitle>快速操作</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={() => setActiveTab('create')}
                >
                  <Plus className="w-6 h-6" />
                  创建处方
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={() => setActiveTab('pending')}
                >
                  <Clock className="w-6 h-6" />
                  查看待处理
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={() => setActiveTab('all')}
                >
                  <FileText className="w-6 h-6" />
                  所有处方
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 全部处方 */}
        <TabsContent value="all">
          <PrescriptionListManager 
            doctorId={user?.id}
            showCreateButton={false}
          />
        </TabsContent>

        {/* 待处理处方 */}
        <TabsContent value="pending">
          <PrescriptionListManager 
            doctorId={user?.id}
            showCreateButton={false}
            defaultStatus={PrescriptionStatus.PENDING}
          />
        </TabsContent>

        {/* 创建处方 */}
        <TabsContent value="create">
          <PrescriptionCreator
            onSuccess={() => {
              setActiveTab('all');
              loadStats(); // 刷新统计数据
            }}
            onCancel={() => setActiveTab('overview')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 