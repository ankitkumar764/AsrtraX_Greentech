// Rule-based and ML-powered recommendation engine for crops and fertilizers
const axios = require('axios');

class RecommendationEngine {
  constructor() {
    this.emojis = {
      wheat: '🌾', rice: '🍚', maize: '🌽', cotton: '☁️',
      sugarcane: '🎋', pulses: '🫘', vegetables: '🥦',
      soybean: '🌱', groundnut: '🥜', mustard: '🌱'
    };
    this.fertilizers = {
      urea: { costPerBag: 300, nContent: 46 }, // 46% Nitrogen
      dap: { costPerBag: 1350, nContent: 18, pContent: 46 }, // 18% N, 46% P
      mop: { costPerBag: 1700, kContent: 60 } // 60% Potassium
    };
    this.cropDatabase = {
      wheat: {
        soilType: ['black', 'clay', 'loamy'],
        season: ['rabi'],
        phRange: { min: 6.0, max: 7.5 },
        nFertilizer: { winter: 100, spring: 50 },
        pFertilizer: { application: 50 },
        kFertilizer: { application: 40 },
        waterNeeds: 'moderate',
        minRainfall: 40,
        climate: ['temperate', 'subtropical'],
        costPerKg: 30, // Market Price
        yieldPotential: { min: 4, max: 6 }, // tons/hectare
        baseCosts: { seed: 1500, labor: 4000 } // per hectare
      },
      rice: {
        soilType: ['clay', 'loamy'],
        season: ['kharif'],
        phRange: { min: 5.5, max: 7.0 },
        nFertilizer: { application: 120 },
        pFertilizer: { application: 60 },
        kFertilizer: { application: 60 },
        waterNeeds: 'high',
        minRainfall: 100,
        climate: ['tropical', 'subtropical'],
        costPerKg: 40,
        yieldPotential: { min: 4, max: 7 },
        baseCosts: { seed: 1200, labor: 6000 }
      },
      maize: {
        soilType: ['loamy', 'sandy loam'],
        season: ['kharif', 'rabi'],
        phRange: { min: 5.8, max: 7.3 },
        nFertilizer: { application: 150 },
        pFertilizer: { application: 70 },
        kFertilizer: { application: 40 },
        waterNeeds: 'moderate',
        minRainfall: 50,
        climate: ['tropical', 'subtropical'],
        costPerKg: 25,
        yieldPotential: { min: 5, max: 8 },
        baseCosts: { seed: 2000, labor: 3000 }
      },
      cotton: {
        soilType: ['black', 'loamy'],
        season: ['kharif'],
        phRange: { min: 6.0, max: 7.5 },
        nFertilizer: { application: 100 },
        pFertilizer: { application: 50 },
        kFertilizer: { application: 50 },
        waterNeeds: 'moderate',
        minRainfall: 50,
        climate: ['tropical'],
        costPerKg: 80,
        yieldPotential: { min: 1.5, max: 2.5 }, 
        baseCosts: { seed: 3500, labor: 8000 }
      },
      sugarcane: {
        soilType: ['clay', 'loamy', 'black'],
        season: ['kharif', 'rabi'],
        phRange: { min: 6.0, max: 7.5 },
        nFertilizer: { application: 200 },
        pFertilizer: { application: 80 },
        kFertilizer: { application: 100 },
        waterNeeds: 'high',
        minRainfall: 75,
        climate: ['tropical', 'subtropical'],
        costPerKg: 5,
        yieldPotential: { min: 60, max: 100 }, 
        baseCosts: { seed: 8000, labor: 12000 }
      },
      pulses: {
        soilType: ['sandy', 'loamy'],
        season: ['rabi'],
        phRange: { min: 6.0, max: 7.5 },
        nFertilizer: { application: 20 },
        pFertilizer: { application: 45 },
        kFertilizer: { application: 20 },
        waterNeeds: 'low',
        minRainfall: 30,
        climate: ['temperate', 'subtropical'],
        costPerKg: 50,
        yieldPotential: { min: 1.5, max: 3 },
        baseCosts: { seed: 2500, labor: 2500 }
      },
      vegetables: {
        soilType: ['loamy', 'clay loam'],
        season: ['kharif', 'rabi'],
        phRange: { min: 6.0, max: 7.5 },
        nFertilizer: { application: 100 },
        pFertilizer: { application: 60 },
        kFertilizer: { application: 50 },
        waterNeeds: 'moderate',
        minRainfall: 40,
        climate: ['tropical', 'subtropical'],
        costPerKg: 30,
        yieldPotential: { min: 8, max: 15 },
        baseCosts: { seed: 5000, labor: 7000 }
      },
      bajra: {
        soilType: ['sandy', 'loamy'],
        season: ['kharif'],
        phRange: { min: 6.5, max: 8.5 },
        nFertilizer: { application: 40 },
        pFertilizer: { application: 20 },
        kFertilizer: { application: 20 },
        waterNeeds: 'low',
        minRainfall: 30,
        climate: ['tropical', 'arid'],
        costPerKg: 20,
        yieldPotential: { min: 1, max: 2 },
        baseCosts: { seed: 500, labor: 1500 }
      }
    };
  }

  attachEmoji(name) {
    const crop = name.toLowerCase();
    const emoji = this.emojis[crop] || '🌱';
    return `${name} ${emoji}`;
  }

  scoreCrop(cropName, inputs) {
    const crop = this.cropDatabase[cropName.toLowerCase()];
    if (!crop) return 0;

    let score = 100;
    let deductions = 0;

    if (!crop.soilType.includes(inputs.soilType?.toLowerCase())) {
      deductions += 15;
    }

    if (inputs.season && !crop.season.includes(inputs.season?.toLowerCase())) {
      deductions += 20;
    }

    if (inputs.pH) {
      const soilPh = parseFloat(inputs.pH);
      if (soilPh < crop.phRange.min || soilPh > crop.phRange.max) {
        deductions += 10;
      }
    }

    if (inputs.waterAvailability === 'low' && crop.waterNeeds === 'high') {
      deductions += 25;
    } else if (inputs.waterAvailability === 'high' && crop.waterNeeds === 'low') {
      deductions += 5;
    }

    if (inputs.budget && inputs.budget < crop.costPerKg * 1000) {
      deductions += 15;
    }

    if (inputs.previousCrop && inputs.previousCrop.toLowerCase() === cropName.toLowerCase()) {
      deductions += 20; 
    }

    return Math.max(0, score - deductions);
  }

  recommendCrops(inputs) {
    const crops = Object.keys(this.cropDatabase);
    const scores = crops.map(crop => ({
      name: crop,
      score: this.scoreCrop(crop, inputs),
      details: this.cropDatabase[crop]
    }));

    return scores
      .filter(c => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  calculateNPK(crop, soilN, soilP, soilK, pH) {
    const cropData = this.cropDatabase[crop.toLowerCase()];
    if (!cropData) return null;

    const requiredN = cropData.nFertilizer.application || 100;
    const requiredP = cropData.pFertilizer.application || 50;
    const requiredK = cropData.kFertilizer.application || 40;

    const deficitN = Math.max(0, requiredN - (soilN || 0));
    const deficitP = Math.max(0, requiredP - (soilP || 0));
    const deficitK = Math.max(0, requiredK - (soilK || 0));

    return {
      nitrogen: { required: requiredN, deficit: deficitN, applicationType: 'urea' },
      phosphorus: { required: requiredP, deficit: deficitP, applicationType: 'dap' },
      potassium: { required: requiredK, deficit: deficitK, applicationType: 'mop' }
    };
  }

  recommendFertilizers(crop, npk, budget, landArea = 1) {
    const recommendations = [];
    const deficitN = npk.nitrogen.deficit;
    const deficitP = npk.phosphorus.deficit;
    const deficitK = npk.potassium.deficit;
    
    const haToAcre = 2.471;

    // First priority: DAP
    const dapBagsPerHa = Math.ceil(deficitP / (this.fertilizers.dap.pContent * 50 / 100));
    const finalDapBags = Math.ceil(dapBagsPerHa * landArea);
    const dapCost = finalDapBags * this.fertilizers.dap.costPerBag;
    const dapKgPerAcre = ((dapBagsPerHa * 50) / haToAcre).toFixed(1);

    if (finalDapBags > 0) {
      recommendations.push({
        name: 'DAP (Di-Ammonium Phosphate)',
        bags: finalDapBags,
        perAcre: `${dapKgPerAcre} kg/acre`,
        timing: 'TIMING_PLANTING',
        cost: dapCost,
        reason: 'F_REASON_ROOTS'
      });
    }

    // Second priority: Urea
    const remainingN = deficitN - (dapBagsPerHa * 50 * this.fertilizers.dap.nContent / 100);
    const ureaBagsPerHa = Math.max(0, Math.ceil(remainingN / (this.fertilizers.urea.nContent * 50 / 100)));
    const finalUreaBags = Math.ceil(ureaBagsPerHa * landArea);
    const ureaCost = finalUreaBags * this.fertilizers.urea.costPerBag;
    const ureaKgPerAcre = ((ureaBagsPerHa * 50) / haToAcre).toFixed(1);

    if (finalUreaBags > 0) {
      recommendations.push({
        name: 'Urea',
        bags: finalUreaBags,
        perAcre: `${ureaKgPerAcre} kg/acre`,
        timing: 'TIMING_TILLERING',
        cost: ureaCost,
        reason: 'F_REASON_VEGETATIVE'
      });
    }

    // Third priority: MOP
    const mopBagsPerHa = Math.ceil(deficitK / (this.fertilizers.mop.kContent * 50 / 100));
    const finalMopBags = Math.ceil(mopBagsPerHa * landArea);
    const mopCost = finalMopBags * this.fertilizers.mop.costPerBag;
    const mopKgPerAcre = ((mopBagsPerHa * 50) / haToAcre).toFixed(1);

    if (finalMopBags > 0) {
      recommendations.push({
        name: 'MOP (Muriate of Potash)',
        bags: finalMopBags,
        perAcre: `${mopKgPerAcre} kg/acre`,
        timing: 'TIMING_FLOWERING',
        cost: mopCost,
        reason: 'F_REASON_GRAIN'
      });
    }

    const totalCost = recommendations.reduce((sum, r) => sum + r.cost, 0);

    return {
      recommendations,
      totalCost,
      totalCostRaw: totalCost,
      costPerHectare: totalCost / landArea,
      notes: this.generateFertilizerNotes(crop, budget, totalCost)
    };
  }

  generateFertilizerNotes(crop, budget, totalCost) {
    const notes = [];

    if (budget && totalCost > budget) {
      notes.push('F_NOTE_EXCEEDS_BUDGET');
    } else if (budget && totalCost < budget * 0.7) {
      notes.push('F_NOTE_WITHIN_BUDGET');
    }

    notes.push('F_NOTE_ORGANIC');
    notes.push('F_NOTE_OFFICER');

    return notes;
  }

  calculateFinancials(cropName, fertilizerCost, landArea) {
    const crop = this.cropDatabase[cropName.toLowerCase()];
    if (!crop) return null;

    const area = parseFloat(landArea) || 1;
    const avgYield = (crop.yieldPotential.min + crop.yieldPotential.max) / 2;
    const totalYieldKg = avgYield * 1000 * area;
    const totalRevenue = totalYieldKg * crop.costPerKg;
    
    const seedCost = crop.baseCosts.seed * area;
    const laborCost = crop.baseCosts.labor * area;
    const totalInvestment = seedCost + laborCost + (fertilizerCost || 0);
    
    const netProfit = totalRevenue - totalInvestment;

    return {
      revenue: totalRevenue,
      investment: totalInvestment,
      profit: netProfit,
      breakdown: {
        seed: seedCost,
        labor: laborCost,
        fertilizer: fertilizerCost || 0
      }
    };
  }

  async generateRecommendations(inputs, isSoilReport = false) {
    let cropRecommendations = this.recommendCrops(inputs);
    const landArea = parseFloat(inputs.landArea) || 1;

    let mlRecommendation = null;
    if (isSoilReport) {
      try {
        const mlResponse = await axios.post('http://localhost:5000/predict', {
          N: parseFloat(inputs.soilN) || 0,
          P: parseFloat(inputs.soilP) || 0,
          K: parseFloat(inputs.soilK) || 0,
          ph: parseFloat(inputs.pH) || 6.5
        });

        if (mlResponse.data && mlResponse.data.recommended_crop) {
          mlRecommendation = {
            name: mlResponse.data.recommended_crop.toLowerCase(),
            score: mlResponse.data.confidence,
            isML: true
          };
          
          const existingIdx = cropRecommendations.findIndex(c => c.name === mlRecommendation.name);
          if (existingIdx !== -1) {
            cropRecommendations[existingIdx].score = mlRecommendation.score;
            cropRecommendations[existingIdx].isML = true;
            const [mlItem] = cropRecommendations.splice(existingIdx, 1);
            cropRecommendations.unshift(mlItem);
          } else if (this.cropDatabase[mlRecommendation.name]) {
            cropRecommendations.unshift({
                name: mlRecommendation.name,
                score: mlRecommendation.score,
                details: this.cropDatabase[mlRecommendation.name],
                isML: true
            });
          }
        }
      } catch (error) {
        console.error('ML Service Error:', error.message);
      }
    }

    if (cropRecommendations.length === 0) {
      return {
        success: false,
        message: 'Could not find suitable crops for your conditions',
        crops: []
      };
    }

    const soilN = parseFloat(inputs.soilN) || 50;
    const soilP = parseFloat(inputs.soilP) || 10;
    const soilK = parseFloat(inputs.soilK) || 30;
    const soilPH = parseFloat(inputs.pH) || 6.5;

    const healthScore = (soilN + soilP + soilK) / 3;
    let soilHealthStatus = 'SOIL_HEALTH_MEDIUM';
    let healthNotes = 'SOIL_HEALTH_MEDIUM_NOTES';
    
    let deficiencies = [];
    if (soilN < 80) deficiencies.push('N_LOW');
    if (soilP < 20) deficiencies.push('P_LOW');
    if (soilK < 40) deficiencies.push('K_LOW');
    
    let excesses = [];
    if (soilN > 250) excesses.push('N_HIGH');
    if (soilP > 100) excesses.push('P_HIGH');
    if (soilK > 300) excesses.push('K_HIGH');

    if (healthScore > 80 && soilPH >= 6.0 && soilPH <= 7.5 && deficiencies.length === 0) {
      soilHealthStatus = 'SOIL_HEALTH_GOOD';
      healthNotes = 'SOIL_HEALTH_GOOD_NOTES';
    } else if (healthScore < 30 || soilPH < 5.5 || soilPH > 8.0 || deficiencies.length > 1) {
      soilHealthStatus = 'SOIL_HEALTH_POOR';
      healthNotes = 'SOIL_HEALTH_POOR_NOTES';
    } else if (deficiencies.length > 0 || excesses.length > 0) {
      healthNotes = 'SOIL_HEALTH_IMBALANCED_NOTES';
    }

    let confidenceLevelStr = 'CONFIDENCE_HIGH';
    if (isSoilReport) {
       confidenceLevelStr = 'CONFIDENCE_PRECISION';
    } else if (inputs.soilType && inputs.soilType !== 'unknown') {
       confidenceLevelStr = 'CONFIDENCE_APPROXIMATE';
    } else {
       confidenceLevelStr = 'CONFIDENCE_LOW';
    }

    const detailedRecommendations = cropRecommendations.map(crop => {
      const npk = this.calculateNPK(crop.name, soilN, soilP, soilK, soilPH);
      const fertilizer = this.recommendFertilizers(crop.name, npk, inputs.budget, landArea);
      const financials = this.calculateFinancials(crop.name, fertilizer.totalCost, landArea);

      return {
        rank: cropRecommendations.indexOf(crop) + 1,
        cropName: this.attachEmoji(crop.name.charAt(0).toUpperCase() + crop.name.slice(1)),
        matchScore: crop.score,
        reasoning: this.generateCropReasoning(crop.name, inputs),
        npkRequirements: npk,
        fertilizerPlan: fertilizer,
        financials: financials,
        landAreaUsed: landArea,
        estimatedYield: crop.details.yieldPotential,
        costOptimizationKey: `OPTIMIZE_${crop.name.toUpperCase()}`,
        impact: {
          costSavings: Math.round(fertilizer.totalCost * 0.15),
          fertilizerSavings: Math.round(fertilizer.totalCost * 0.2),
          expectedYieldImprovement: Math.round(crop.score > 80 ? 25 : 15),
        }
      };
    });

    let warning = null;
    if (inputs.fertilizationHistory === 'excessive') {
      warning = 'WARNING_EXCESSIVE_USAGE';
    }

    return {
      success: true,
      recommendations: detailedRecommendations,
      landArea: landArea,
      soilHealth: {
        status: soilHealthStatus,
        notes: healthNotes
      },
      confidenceLevel: confidenceLevelStr,
      warning: warning,
      generalAdvice: this.generateGeneralAdvice(inputs)
    };
  }

  generateCropReasoning(crop, inputs) {
    const reasons = [];
    const cropData = this.cropDatabase[crop.toLowerCase()];

    if (cropData.soilType.includes(inputs.soilType?.toLowerCase())) {
      reasons.push('REASON_SOIL_MATCH_IDEAL');
    } else if (inputs.soilType && inputs.soilType !== 'unknown') {
      reasons.push('REASON_SOIL_MATCH_MANAGEMENT');
    }

    if (inputs.waterAvailability) {
      if (inputs.waterAvailability === 'high' && cropData.waterNeeds === 'high') {
        reasons.push('REASON_WATER_MATCH_HIGH');
      } else if (inputs.waterAvailability === 'low' && cropData.waterNeeds === 'low') {
        reasons.push('REASON_WATER_MATCH_LOW');
      } else if (inputs.waterAvailability === 'medium' || inputs.waterAvailability === 'moderate') {
        reasons.push('REASON_WATER_MATCH_MODERATE');
      } else {
        reasons.push('REASON_WATER_NEEDS');
      }
    }

    if (inputs.previousCrop && inputs.previousCrop.toLowerCase() !== crop.toLowerCase() && inputs.previousCrop !== 'fallow') {
      reasons.push('REASON_ROTATION_BENEFIT');
    }

    if (cropData.season.includes(inputs.season?.toLowerCase())) {
      reasons.push('REASON_SEASON_MATCH');
    }

    return reasons.length > 0 ? reasons : ['REASON_ROBUST_CHOICE'];
  }

  generateGeneralAdvice(inputs) {
    const advice = [];

    if (inputs.soilType === 'unknown') advice.push('ADVICE_SOIL_TEST');
    if (inputs.soilTestReport === false && !inputs.soilType) advice.push('ADVICE_VISIT_LAB');
    if (inputs.fertilizationHistory === 'excessive') advice.push('ADVICE_REDUCE_FERTILIZER');
    if (inputs.waterAvailability === 'low') advice.push('ADVICE_DRIP_IRRIGATION');
    advice.push('ADVICE_MONITOR_HEALTH');

    return advice;
  }

  suggestCostOptimizations() {
    return [
      'OPTIMIZE_ORGANIC_MANURE',
      'OPTIMIZE_BULK_BUYING',
      'OPTIMIZE_GOVT_SCHEMES',
      'OPTIMIZE_ALTERNATE',
      'OPTIMIZE_SOIL_CONSERVATION'
    ];
  }
}

module.exports = new RecommendationEngine();
