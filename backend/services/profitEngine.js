// Crop Economics Database for Profit Analysis
const cropEconomics = {
  wheat: {
    season: ['rabi'],
    soilType: ['loamy', 'clay', 'black'],
    phRange: { min: 6.0, max: 7.5 },
    metricsPerAcre: {
      seedCost: 1500, // INR
      fertilizerCost: 3000, 
      irrigationCost: 2000,
      laborCost: 4000,
      yieldQuintals: 18, // 18 quintals per acre
      marketPricePerQuintal: 2500 // INR per quintal
    }
  },
  rice: {
    season: ['kharif'],
    soilType: ['clay', 'loamy'],
    phRange: { min: 5.5, max: 7.0 },
    metricsPerAcre: {
      seedCost: 1200,
      fertilizerCost: 4000,
      irrigationCost: 6000,
      laborCost: 6000,
      yieldQuintals: 22,
      marketPricePerQuintal: 2200
    }
  },
  maize: {
    season: ['kharif', 'rabi'],
    soilType: ['loamy', 'sandy'],
    phRange: { min: 5.8, max: 7.3 },
    metricsPerAcre: {
      seedCost: 2000,
      fertilizerCost: 2500,
      irrigationCost: 1500,
      laborCost: 3000,
      yieldQuintals: 25,
      marketPricePerQuintal: 2000
    }
  },
  cotton: {
    season: ['kharif'],
    soilType: ['black', 'loamy'],
    phRange: { min: 6.0, max: 7.5 },
    metricsPerAcre: {
      seedCost: 3500,
      fertilizerCost: 4000,
      irrigationCost: 2500,
      laborCost: 8000,
      yieldQuintals: 8,
      marketPricePerQuintal: 7000
    }
  },
  sugarcane: {
    season: ['kharif', 'rabi'],
    soilType: ['clay', 'loamy', 'black'],
    phRange: { min: 6.0, max: 7.5 },
    metricsPerAcre: {
      seedCost: 8000,
      fertilizerCost: 6000,
      irrigationCost: 10000,
      laborCost: 12000,
      yieldQuintals: 300,
      marketPricePerQuintal: 300
    }
  },
  pulses: {
    season: ['rabi', 'kharif'],
    soilType: ['sandy', 'loamy'],
    phRange: { min: 6.0, max: 7.5 },
    metricsPerAcre: {
      seedCost: 2500,
      fertilizerCost: 1000,
      irrigationCost: 1000,
      laborCost: 2500,
      yieldQuintals: 6,
      marketPricePerQuintal: 6500
    }
  },
  vegetables: {
    season: ['kharif', 'rabi'],
    soilType: ['loamy', 'clay'],
    phRange: { min: 6.0, max: 7.5 },
    metricsPerAcre: {
      seedCost: 5000,
      fertilizerCost: 5000,
      irrigationCost: 4000,
      laborCost: 15000,
      yieldQuintals: 80,
      marketPricePerQuintal: 1500
    }
  }
};

class ProfitEngine {
  constructor() {
    this.crops = cropEconomics;
    this.emojis = {
      wheat: '🌾', rice: '🍚', maize: '🌽', cotton: '☁️',
      sugarcane: '🎋', pulses: '🫘', vegetables: '🥦',
      soybean: '🌱', groundnut: '🥜', mustard: '🌱'
    };
  }

  attachEmoji(name) {
    if (!name) return '';
    const cleanName = name.toLowerCase().trim();
    const emoji = this.emojis[cleanName] || '';
    return emoji ? `${emoji} ${name}` : name;
  }

  // Filter crops based on season, soil, logic etc.
  getCompatibleCrops(inputs) {
    const { season, soilType, pH } = inputs;
    let compatible = [];

    for (const [cropName, data] of Object.entries(this.crops)) {
      let score = 0;
      
      // Match season
      if (!season || data.season.includes(season.toLowerCase())) score += 2;
      
      // Match soil
      if (!soilType || soilType === 'unknown' || data.soilType.includes(soilType.toLowerCase())) score += 2;
      
      // Match pH roughly
      if (pH) {
        const phVal = parseFloat(pH);
        if (phVal >= data.phRange.min - 0.5 && phVal <= data.phRange.max + 0.5) score += 1;
      } else {
        score += 1; // Default
      }

      if (score >= 3) { // Threshold for inclusion
        compatible.push(cropName);
      }
    }

    // Default fallback if too restrictive
    if (compatible.length === 0) {
      return ['wheat', 'rice', 'pulses'];
    }

    return compatible.slice(0, 5); // Return top 5
  }

  analyzeProfit(inputs) {
    const { budget, landSize } = inputs;
    const acres = parseFloat(landSize) || 1;
    const totalBudget = parseFloat(budget) || 100000;

    const cropList = this.getCompatibleCrops(inputs);
    
    let analysisResult = cropList.map(crop => {
      const data = this.crops[crop].metricsPerAcre;
      
      // Scale by land size
      const costs = {
        seeds: data.seedCost * acres,
        fertilizer: data.fertilizerCost * acres,
        irrigation: data.irrigationCost * acres,
        labor: data.laborCost * acres
      };
      
      const totalCost = costs.seeds + costs.fertilizer + costs.irrigation + costs.labor;
      const expectedYield = data.yieldQuintals * acres;
      const totalRevenue = expectedYield * data.marketPricePerQuintal;
      const expectedProfit = totalRevenue - totalCost;
      
      const roi = ((expectedProfit / totalCost) * 100).toFixed(1);
      const margin = (expectedProfit / totalRevenue) * 100;

      // Risk Analysis based on Margin and Budget constraint
      let riskLabel = 'Low';
      let riskReason = [];

      if (totalCost > totalBudget) {
        riskLabel = 'High';
        riskReason.push(`Required cost (₹${totalCost}) exceeds your budget (₹${totalBudget}).`);
      }

      if (margin < 30) {
        if (riskLabel !== 'High') riskLabel = 'Medium';
        riskReason.push(`Profit margin is relatively narrow (${margin.toFixed(0)}%).`);
      }

      if (data.irrigationCost > 3000 && inputs.waterAvailability === 'low') {
        riskLabel = 'High';
        riskReason.push('High water requirement mismatch with available resources.');
      }

      if (riskReason.length === 0) {
        riskReason.push('Favorable cost-to-profit ratio.');
      }

      let profitabilityLabel = 'Medium';
      if (margin > 60) profitabilityLabel = 'High';
      else if (margin < 30) profitabilityLabel = 'Low';

      return {
        id: crop,
        name: this.attachEmoji(crop.charAt(0).toUpperCase() + crop.slice(1)),
        costs,
        totalCost,
        expectedYield,
        unit: 'Quintals',
        marketPrice: data.marketPricePerQuintal,
        totalRevenue,
        expectedProfit,
        roi: Number(roi),
        profitabilityLabel,
        risk: {
          level: riskLabel,
          reasons: riskReason
        }
      };
    });

    // Sort by most profitable ROI
    analysisResult.sort((a, b) => b.roi - a.roi);

    return analysisResult;
  }

  generateInsights(analysisResult, budget) {
    if (!analysisResult || analysisResult.length === 0) return null;

    const bestCrop = analysisResult[0];
    
    let recommendationText = `Based on your budget of ₹${budget || 'N/A'}, `;
    recommendationText += `**${bestCrop.name}** gives the highest return on investment (${bestCrop.roi}%) `;
    
    if (bestCrop.risk.level === 'Low') {
      recommendationText += `with a low risk profile. `;
    } else {
      recommendationText += `although it poses a ${bestCrop.risk.level.toLowerCase()} risk. `;
    }
    
    let tips = [
      `Consider modern irrigation to reduce ${bestCrop.name.toLowerCase().replace(/[^a-z]/g, '')} water costs.`,
      `Pooling labor resources with local farmers can save up to 20% on labor costs.`,
      `Apply for government subsidies to offset fertilizer expenses.`
    ];

    if (bestCrop.totalCost > budget) {
        tips.unshift(`⚠️ The total cost (₹${bestCrop.totalCost}) exceeds your budget. Try reducing land size incrementally to match your capital.`);
    }

    return {
      bestCrop: bestCrop.name,
      overview: recommendationText,
      costReductionTips: tips
    };
  }
}

module.exports = new ProfitEngine();
