import React from 'react';
import { HelpCircle, Sparkles, ArrowRight, Check } from 'lucide-react';

export default function CounterfactualCard({
  observed = { temperature: 55.0, pressure: 987.2, humidity: 96.0 },
  expected = { temperature: 31.8, pressure: 1003.2, humidity: 64.5 },
  featureContributions = { temperature: 87, pressure: 21, humidity: 11 },
  onApplyCorrection
}) {
  const diffTemp = parseFloat((observed.temperature - expected.temperature).toFixed(1));
  const diffPress = parseFloat((observed.pressure - expected.pressure).toFixed(1));
  const diffHum = parseFloat((observed.humidity - expected.humidity).toFixed(1));

  return (
    <div className="sentinel-card p-5 bg-gradient-to-br from-white to-blue-50/30 border-blue-200">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-sentinel-border">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-800">Counterfactual AI & Explainability</h3>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700">
          SHAP Feature Attribution
        </span>
      </div>

      {/* Explanatory Prompt */}
      <p className="text-xs text-slate-600 mt-3 italic">
        "What would the observation probably have been if the faulty measurement had been normal?"
      </p>

      {/* Observed vs Expected Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
        {/* Temperature Comparison */}
        <div className="p-3 rounded-md bg-white border border-sentinel-border shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Temperature</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-base font-extrabold text-red-600">{observed.temperature}°C</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className="text-base font-extrabold text-emerald-600">{expected.temperature}°C</span>
          </div>
          <div className="mt-1 text-[10px] flex justify-between text-slate-500">
            <span>Observed</span>
            <span className="font-bold text-red-500">{diffTemp > 0 ? `+${diffTemp}` : diffTemp}°C</span>
            <span>Expected</span>
          </div>
        </div>

        {/* Pressure Comparison */}
        <div className="p-3 rounded-md bg-white border border-sentinel-border shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Pressure</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-base font-extrabold text-slate-800">{observed.pressure} hPa</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className="text-base font-extrabold text-emerald-600">{expected.pressure} hPa</span>
          </div>
          <div className="mt-1 text-[10px] flex justify-between text-slate-500">
            <span>Observed</span>
            <span className="font-bold text-slate-600">{diffPress > 0 ? `+${diffPress}` : diffPress} hPa</span>
            <span>Expected</span>
          </div>
        </div>

        {/* Humidity Comparison */}
        <div className="p-3 rounded-md bg-white border border-sentinel-border shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Humidity</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-base font-extrabold text-slate-800">{observed.humidity}%</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className="text-base font-extrabold text-emerald-600">{expected.humidity}%</span>
          </div>
          <div className="mt-1 text-[10px] flex justify-between text-slate-500">
            <span>Observed</span>
            <span className="font-bold text-slate-600">{diffHum > 0 ? `+${diffHum}` : diffHum}%</span>
            <span>Expected</span>
          </div>
        </div>
      </div>

      {/* SHAP Feature Contribution Bars */}
      <div className="mt-4 pt-3 border-t border-slate-200">
        <h4 className="text-xs font-bold text-slate-700 mb-2">Anomaly Feature Contributions</h4>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs mb-0.5">
              <span className="text-slate-600 font-medium">Temperature Contribution</span>
              <span className="font-bold text-red-600">{featureContributions.temperature}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-red-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${featureContributions.temperature}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-0.5">
              <span className="text-slate-600 font-medium">Pressure Contribution</span>
              <span className="font-bold text-blue-600">{featureContributions.pressure}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${featureContributions.pressure}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-0.5">
              <span className="text-slate-600 font-medium">Humidity Contribution</span>
              <span className="font-bold text-cyan-600">{featureContributions.humidity}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${featureContributions.humidity}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Apply Imputed Correction Action */}
      {onApplyCorrection && (
        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">Apply counterfactual estimate to quarantined observation?</span>
          <button
            onClick={onApplyCorrection}
            className="px-3 py-1.5 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center space-x-1.5 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Corrected Estimate</span>
          </button>
        </div>
      )}
    </div>
  );
}
