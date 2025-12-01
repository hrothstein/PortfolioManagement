import React from 'react';
import { formatCurrency, formatPercent, getChangeColorClass, getChangeIcon } from '../../utils/formatters';

function StatCard({ label, value, change, isCurrency = false, isPercent = false }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">
        {isCurrency ? formatCurrency(value) : isPercent ? formatPercent(value) : value}
      </p>
      {change !== undefined && change !== null && (
        <p className={`text-sm mt-2 ${getChangeColorClass(change)}`}>
          {getChangeIcon(change)} {formatPercent(Math.abs(change))}
        </p>
      )}
    </div>
  );
}

export default StatCard;

