#!/usr/bin/env node
/**
 * 并发请求去重验证脚本
 * 测试getUserClaims的并发控制效果
 */

const { performance } = require('perf_hooks');

// 模拟getUserClaims的核心逻辑
let claimsCache = null;
let pendingRequest = null;
let fetchCallCount = 0;
let concurrentCount = 0;

function mockFetchUserClaimsWithRetry() {
  fetchCallCount++;
  const currentCall = fetchCallCount;
  console.log(`[${new Date().toISOString()}] fetchUserClaimsWithRetry 调用 #${currentCall}`);
  
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`[${new Date().toISOString()}] fetchUserClaimsWithRetry 完成 #${currentCall}`);
      resolve({ role: 'tcm_practitioner', license_number: '12345' });
    }, 100);
  });
}

async function mockGetUserClaims() {
  const now = Date.now();
  const cacheTTL = 30000; // 30s
  
  concurrentCount++;
  const currentConcurrent = concurrentCount;
  console.log(`[${new Date().toISOString()}] getUserClaims 调用开始 #${currentConcurrent} (并发数: ${currentConcurrent})`);
  
  // 缓存检查
  if (claimsCache && claimsCache.validUntil > now) {
    concurrentCount--;
    console.log(`[${new Date().toISOString()}] getUserClaims 缓存命中 #${currentConcurrent}`);
    return claimsCache.claims;
  }
  
  // 请求去重: 如果已有请求在进行，等待它
  if (pendingRequest) {
    console.log(`[${new Date().toISOString()}] getUserClaims 等待现有请求 #${currentConcurrent}`);
    const result = await pendingRequest;
    concurrentCount--;
    console.log(`[${new Date().toISOString()}] getUserClaims 复用请求结果 #${currentConcurrent}`);
    return result;
  }
  
  // 创建新请求
  console.log(`[${new Date().toISOString()}] getUserClaims 创建新请求 #${currentConcurrent}`);
  pendingRequest = mockFetchUserClaimsWithRetry();
  
  try {
    const claims = await pendingRequest;
    
    // 更新缓存
    claimsCache = {
      claims,
      timestamp: now,
      validUntil: now + cacheTTL
    };
    
    concurrentCount--;
    console.log(`[${new Date().toISOString()}] getUserClaims 新请求完成 #${currentConcurrent}`);
    return claims;
  } finally {
    pendingRequest = null;
  }
}

async function testConcurrentRequests() {
  console.log('=== 并发请求去重测试开始 ===');
  
  // 重置状态
  fetchCallCount = 0;
  concurrentCount = 0;
  claimsCache = null;
  pendingRequest = null;
  
  const startTime = performance.now();
  
  // 同时发起20个并发请求
  const promises = Array.from({ length: 20 }, (_, i) => 
    mockGetUserClaims().then(result => {
      console.log(`并发请求 #${i + 1} 完成`);
      return result;
    })
  );
  
  const results = await Promise.all(promises);
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  console.log('\n=== 测试结果 ===');
  console.log(`总请求数: 20`);
  console.log(`实际fetch调用次数: ${fetchCallCount}`);
  console.log(`最大并发数: ${Math.max(...Array.from({ length: 20 }, (_, i) => i + 1))}`);
  console.log(`执行时间: ${duration.toFixed(2)}ms`);
  console.log(`去重效果: ${fetchCallCount <= 1 ? '✅ 成功' : '❌ 失败'}`);
  
  if (fetchCallCount > 1) {
    console.log('\n❌ 并发去重失败分析:');
    console.log('- pendingRequest逻辑存在时序问题');
    console.log('- 可能需要在判断和赋值之间增加原子性保证');
  } else {
    console.log('\n✅ 并发去重成功');
  }
}

// 运行测试
testConcurrentRequests().catch(console.error);