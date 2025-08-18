/**
 * 🔄 代码复用资产 - 药品搜索组件
 * 原项目: B2B2C中医处方履约平台
 * 复用等级: 一级复用 (直接迁移)
 * 适配要求: 保留搜索算法，适配Supabase药品表
 * 测试状态: 已通过完整单元测试和性能测试
 * 
 * @deprecated 需要适配Supabase架构后使用
 * @migration 迁移到Supabase-First架构
 * @business_logic 纯业务逻辑组件，可直接复用
 * @supabase_table 需要适配Supabase medicines表结构
 */

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { mockMedicines } from '@/mocks/medicineData';
import { Medicine } from '@/types/medicine';

interface MedicineSearchProps {
  onSelectMedicine: (medicine: Medicine) => void;
  maxDropdownHeight?: number; // 可以自定义下拉菜单高度
}

// 暴露给父组件的方法
export interface MedicineSearchRef {
  focusInput: () => void;
}

const MedicineSearch = forwardRef<MedicineSearchRef, MedicineSearchProps>(({ 
  onSelectMedicine,
  maxDropdownHeight = 300 // 默认高度
}, ref) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Medicine[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // 暴露聚焦方法给父组件
  useImperativeHandle(ref, () => ({
    focusInput: () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }));
  
  // 自动聚焦到搜索框
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // 搜索药品
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setResults([]);
      setIsDropdownVisible(false);
      return;
    }

    const lowercaseTerm = searchTerm.toLowerCase();
    
    // 搜索中文名、拼音名和英文名
    const filteredResults = mockMedicines.filter(medicine => 
            (medicine.name || medicine.chineseName || '').includes(searchTerm) ||
      (medicine.pinyin || medicine.pinyinName || '').includes(lowercaseTerm) ||
      (medicine.englishName || '').toLowerCase().includes(lowercaseTerm)
    ).slice(0, 15); // 增加显示结果数量至15个
    
    setResults(filteredResults);
    setIsDropdownVisible(filteredResults.length > 0);
    setSelectedIndex(0); // 重置选中项索引
  }, [searchTerm]);

  // 键盘导航
  useHotkeys('down', (e) => {
    e.preventDefault();
    if (results.length > 0) {
      const newIndex = (selectedIndex + 1) % results.length;
      setSelectedIndex(newIndex);
      
      // 自动滚动到选中的项
      ensureItemVisible(newIndex);
    }
  }, { enableOnFormTags: true, enabled: isDropdownVisible });
  
  useHotkeys('up', (e) => {
    e.preventDefault();
    if (results.length > 0) {
      const newIndex = (selectedIndex - 1 + results.length) % results.length;
      setSelectedIndex(newIndex);
      
      // 自动滚动到选中的项
      ensureItemVisible(newIndex);
    }
  }, { enableOnFormTags: true, enabled: isDropdownVisible });
  
  useHotkeys('enter', (e) => {
    if (isDropdownVisible && results.length > 0) {
      e.preventDefault();
      handleSelectMedicine(results[selectedIndex]);
    }
  }, { enableOnFormTags: true, enabled: isDropdownVisible });

  // 确保选中的项在视野内
  const ensureItemVisible = (index: number) => {
    if (dropdownRef.current) {
      const dropdown = dropdownRef.current;
      const items = dropdown.querySelectorAll('li');
      if (items[index]) {
        const item = items[index];
        const dropdownTop = dropdown.scrollTop;
        const dropdownBottom = dropdownTop + dropdown.clientHeight;
        const itemTop = item.offsetTop;
        const itemBottom = itemTop + item.clientHeight;

        if (itemTop < dropdownTop) {
          dropdown.scrollTop = itemTop;
        } else if (itemBottom > dropdownBottom) {
          dropdown.scrollTop = itemBottom - dropdown.clientHeight;
        }
      }
    }
  };

  // 处理选择药品
  const handleSelectMedicine = (medicine: Medicine) => {
    onSelectMedicine(medicine);
    setSearchTerm('');
    setResults([]);
    setIsDropdownVisible(false);
  };

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) && 
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <input
          ref={inputRef}
          type="text"
          className="w-full px-4 py-2 outline-none"
          placeholder="搜索药材..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (searchTerm.trim() !== '' && results.length > 0) {
              setIsDropdownVisible(true);
            }
          }}
        />
        {searchTerm && (
          <button
            className="p-2 text-gray-500 hover:text-gray-700"
            onClick={() => {
              setSearchTerm('');
              setResults([]);
              setIsDropdownVisible(false);
              inputRef.current?.focus();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {isDropdownVisible && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-y-auto" 
          style={{ maxHeight: `${maxDropdownHeight}px` }}
        >
          <ul className="divide-y divide-gray-100">
            {results.map((medicine, index) => (
              <li
                key={medicine.id}
                className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                  index === selectedIndex ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleSelectMedicine(medicine)}
              >
                <div className="font-medium text-gray-900">{medicine.chineseName}</div>
                <div className="text-sm text-gray-500 mt-1">{medicine.englishName} ({medicine.pinyinName})</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

MedicineSearch.displayName = 'MedicineSearch';

export default MedicineSearch; 