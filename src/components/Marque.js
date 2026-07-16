import React from 'react';

export default function Marquee({ children, color }) {
  return (
    <div class="nb-marquee orange">
      <div class="nb-marquee-content">
        <span>Storage Account</span>
        <span>Database</span>
        <span>API</span>
        <span>Data Warehouse</span>
        <span>Security</span>
        <span>Azure Resource</span>
        <span>Devops</span>
        <span>AI Agent</span>
      </div>
    </div>
  );
}
