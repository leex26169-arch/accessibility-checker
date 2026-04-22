// 更新颜色显示值
  document.getElementById('bgColor').addEventListener('input', function(e) {
      document.getElementById('bgColorValue').textContent = e.target.value.toUpperCase();
  });

  document.getElementById('fgColor').addEventListener('input', function(e) {
      document.getElementById('fgColorValue').textContent = e.target.value.toUpperCase();
  });

  // 计算对比度函数
  function getContrastRatio(color1, color2) {
      const lum1 = getLuminance(color1);
      const lum2 = getLuminance(color2);
      const brightest = Math.max(lum1, lum2);
      const darkest = Math.min(lum1, lum2);
      return (brightest + 0.05) / (darkest + 0.05);
  }

  function getLuminance(hexColor) {
      const rgb = hexToRgb(hexColor);
      const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
          val = val / 255;
          return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
      } : null;
  }

  // 检查对比度
  function checkContrast() {
      const bgColor = document.getElementById('bgColor').value;
      const fgColor = document.getElementById('fgColor').value;

      const contrastRatio = getContrastRatio(bgColor, fgColor);
      const wcagAA = contrastRatio >= 4.5;
      const wcagAAA = contrastRatio >= 7;

      const resultHTML = `
          <p><strong>对比度：</strong> ${contrastRatio.toFixed(2)}:1</p>
          <p><strong>WCAG AA 标准：</strong> ${wcagAA ? '✅ 通过' : '❌ 失败'}（正常文字要求 4.5:1）</p>
          <p><strong>WCAG AAA 标准：</strong> ${wcagAAA ? '✅ 通过' : '❌ 失败'}（正常文字要求 7:1）</p>
          ${!wcagAA ? '<p style="color: #d32f2f;">⚠️  建议：增加对比度以符合无障碍标准</p>' : '<p style="color: #388e3c;">✅ 配色符合无障碍标准！</p>'}
      `;

      document.getElementById('contrastResult').innerHTML = resultHTML;
      updateReport();
  }

  // 检查色盲友好性
  function checkColorBlind() {
      const color1 = document.getElementById('color1').value;
      const color2 = document.getElementById('color2').value;

      // 简化的色盲模拟（基于亮度差异）
      const lum1 = getLuminance(color1);
      const lum2 = getLuminance(color2);
      const difference = Math.abs(lum1 - lum2);

      const isFriendly = difference > 0.3; // 亮度差异大于 0.3 视为友好

      const resultHTML = `
          <p><strong>颜色1：</strong> ${color1.toUpperCase()}</p>
          <p><strong>颜色2：</strong> ${color2.toUpperCase()}</p>
          <p><strong>亮度差异：</strong> ${difference.toFixed(3)}</p>
          <p><strong>色盲友好性：</strong> ${isFriendly ? '✅ 良好' : '⚠️  需改进'}</p>
          ${!isFriendly ? '<p style="color: #d32f2f;">⚠️  建议：增加颜色亮度差异，或添加纹理/图标辅助识别</p>' : '<p style="color: #388e3c;">✅ 配色对色盲用户友好！</p>'}
      `;

      document.getElementById('colorBlindResult').innerHTML = resultHTML;
      updateReport();
  }

  // 更新检查报告
  function updateReport() {
      const contrastResult = document.getElementById('contrastResult').innerHTML;
      const colorBlindResult = document.getElementById('colorBlindResult').innerHTML;

      if (contrastResult || colorBlindResult) {
          const reportHTML = `
              <h3>本次检查摘要</h3>
              <p>✅ 颜色对比度检查完成</p>
              <p>✅ 色盲友好性测试完成</p>
              <p>💡 建议：根据上述检查结果优化配色方案</p>
              <p style="margin-top: 15px; font-size: 0.9em; color: #666;">
                  检查标准：WCAG 2.1 AA 级别
              </p>
          `;
          document.getElementById('report').innerHTML = reportHTML;
      }
  }

  // 页面加载时初始化
  window.onload = function() {
      console.log('无障碍设计检查工具已加载');
  };
