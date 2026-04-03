// Rule-based recommendation engine for crops and fertilizers

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
          yieldPotential: { min: 1.5, max: 2.5 }, // corrected to match typical yield
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
          yieldPotential: { min: 60, max: 100 }, // tons/hectare
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
          pContent: 46,
          kContent: 0,
          costPerBag: 1100, // 50kg bag
          applicationType: 'basal',
          timing: ['planting'],
          soilPhSuitability: 'acidic to neutral'
        },
        mop: {
          nContent: 0,
          pContent: 0,
          kContent: 60,
          costPerBag: 600, // 50kg bag
          applicationType: 'split',
          timing: ['flowering', 'fruiting'],
          soilPhSuitability: 'all'
        },
        neem: {
          nContent: 3,
          pContent: 1,
          kContent: 1,
          costPerBag: 400, // 50kg bag
          applicationType: 'soil',
          timing: ['pre-planting'],
          soilPhSuitability: 'all'
        },
        organic: {
          nContent: 2,
          pContent: 1,
          kContent: 1,
          costPerBag: 300, // 50kg bag
          applicationType: 'soil incorporation',
          timing: ['pre-planting'],
          soilPhSuitability: 'all'
        }
      };
    }
  
    // Score crops based on soil and climate conditions
    scoreCrop(cropName, inputs) {
      const crop = this.cropDatabase[cropName.toLowerCase()];
      if (!crop) return 0;
  
      let score = 100;
      let deductions = 0;
  
      // Soil type compatibility
      if (!crop.soilType.includes(inputs.soilType?.toLowerCase())) {
        deductions += 15;
      }
  
      // Season compatibility
      if (inputs.season && !crop.season.includes(inputs.season?.toLowerCase())) {
        deductions += 20;
      }
  
      // pH compatibility
      if (inputs.pH) {
        const soilPh = parseFloat(inputs.pH);
        if (soilPh < crop.phRange.min || soilPh > crop.phRange.max) {
          deductions += 10;
        }
      }
  
      // Water availability
      if (inputs.waterAvailability === 'low' && crop.waterNeeds === 'high') {
        deductions += 25;
      } else if (inputs.waterAvailability === 'high' && crop.waterNeeds === 'low') {
        deductions += 5;
      }
  
      // Budget compatibility
      if (inputs.budget && inputs.budget < crop.costPerKg * 1000) {
        deductions += 15;
      }
  
      // Previous crop (crop rotation)
      if (inputs.previousCrop && inputs.previousCrop.toLowerCase() === cropName.toLowerCase()) {
        deductions += 20; // Penalize same crop
      }
  
      return Math.max(0, score - deductions);
    }
  
    // Get top crop recommendations
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
  
    // Calculate NPK requirements based on soil and crop
    calculateNPK(crop, soilN, soilP, soilK, pH) {
      const cropData = this.cropDatabase[crop.toLowerCase()];
      if (!cropData) return null;
  
      const requiredN = cropData.nFertilizer.application || 100;
      const requiredP = cropData.pFertilizer.application || 50;
      const requiredK = cropData.kFertilizer.application || 40;
  
      // Adjust for existing soil nutrients
      const deficitN = Math.max(0, requiredN - (soilN || 0));
      const deficitP = Math.max(0, requiredP - (soilP || 0));
      const deficitK = Math.max(0, requiredK - (soilK || 0));
  
      return {
        nitrogen: { required: requiredN, deficit: deficitN, applicationType: 'urea' },
        phosphorus: { required: requiredP, deficit: deficitP, applicationType: 'dap' },
        potassium: { required: requiredK, deficit: deficitK, applicationType: 'mop' }
      };
    }
  
    // Recommend fertilizer schedule
    recommendFertilizers(crop, npk, budget, landArea = 1) {
      const recommendations = [];
      const deficitN = npk.nitrogen.deficit;
      const deficitP = npk.phosphorus.deficit;
      const deficitK = npk.potassium.deficit;
  
      // First priority: DAP (provides P and some N)
      const dapBagsPerHa = Math.ceil(deficitP / (this.fertilizers.dap.pContent * 50 / 100));
      const finalDapBags = Math.ceil(dapBagsPerHa * landArea);
      const dapCost = finalDapBags * this.fertilizers.dap.costPerBag;
  
      if (finalDapBags > 0) {
        recommendations.push({
          name: 'DAP (Di-Ammonium Phosphate)',
          bags: finalDapBags,
          timing: 'At the time of planting',
          cost: dapCost,
          reason: 'Provides phosphorus and nitrogen for root development'
        });
      }
  
      // Second priority: Urea for nitrogen
      const remainingN = deficitN - (dapBagsPerHa * 50 * this.fertilizers.dap.nContent / 100);
      const ureaBagsPerHa = Math.max(0, Math.ceil(remainingN / (this.fertilizers.urea.nContent * 50 / 100)));
      const finalUreaBags = Math.ceil(ureaBagsPerHa * landArea);
      const ureaCost = finalUreaBags * this.fertilizers.urea.costPerBag;
  
      if (finalUreaBags > 0) {
        recommendations.push({
          name: 'Urea',
          bags: finalUreaBags,
          timing: 'Split application: Half at tillering, half at boot stage',
          cost: ureaCost,
          reason: 'Provides nitrogen for vegetative growth'
        });
      }
  
      // Third priority: MOP for potassium
      const mopBagsPerHa = Math.ceil(deficitK / (this.fertilizers.mop.kContent * 50 / 100));
      const finalMopBags = Math.ceil(mopBagsPerHa * landArea);
      const mopCost = finalMopBags * this.fertilizers.mop.costPerBag;
  
      if (finalMopBags > 0) {
        recommendations.push({
          name: 'MOP (Muriate of Potash)',
          bags: finalMopBags,
          timing: 'At flowering stage',
          cost: mopCost,
          reason: 'Strengthens plants and improves grain filling'
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
        notes.push(`⚠️ Total fertilizer cost (₹${totalCost.toFixed(0)}) exceeds your budget (₹${budget}). Consider using organic manure to reduce costs.`);
      } else if (budget && totalCost < budget * 0.7) {
        const remaining = budget - totalCost;
        notes.push(`✓ Fertilizer plan is within budget with ₹${remaining.toFixed(0)} remaining.`);
      }
  
      notes.push('💡 For organic farming, use compost or vermicompost alongside chemical fertilizers.');
      notes.push('🌾 Always follow local agricultural officer recommendations.');
  
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
  
    // Generate recommendations based on questionnaire inputs
    generateRecommendations(inputs) {
      const cropRecommendations = this.recommendCrops(inputs);
      const landArea = parseFloat(inputs.landArea) || 1;
  
      if (cropRecommendations.length === 0) {
        return {
          success: false,
          message: 'Could not find suitable crops for your conditions',
          crops: []
        };
      }
  
      const detailedRecommendations = cropRecommendations.map(crop => {
        const npk = this.calculateNPK(
          crop.name,
          inputs.soilN || 50,
          inputs.soilP || 10,
          inputs.soilK || 30,
          inputs.pH || 6.5
        );
  
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
          costOptimization: this.suggestCostOptimizations(crop.name, fertilizer)
        };
      });
  
      return {
        success: true,
        recommendations: detailedRecommendations,
        landArea: landArea,
        generalAdvice: this.generateGeneralAdvice(inputs)
      };
    }
  
    generateCropReasoning(crop, inputs) {
      const reasons = [];
      const cropData = this.cropDatabase[crop.toLowerCase()];
  
      if (cropData.season.includes(inputs.season?.toLowerCase())) {
        reasons.push(`✓ Perfect season match for ${inputs.season}`);
      }
  
      if (cropData.soilType.includes(inputs.soilType?.toLowerCase())) {
        reasons.push(`✓ Ideal for ${inputs.soilType} soil`);
      }
  
      if (inputs.waterAvailability === 'high' && cropData.waterNeeds === 'high') {
        reasons.push(`✓ Well-suited for high water availability areas`);
      }
  
      if (inputs.previousCrop && inputs.previousCrop.toLowerCase() !== crop.toLowerCase()) {
        const prevCropWithEmoji = this.attachEmoji(inputs.previousCrop.charAt(0).toUpperCase() + inputs.previousCrop.slice(1));
        reasons.push(`✓ Good crop rotation after ${prevCropWithEmoji}`);
      }
  
      return reasons.length > 0 ? reasons : ['Suitable crop for your region'];
    }
  
    generateGeneralAdvice(inputs) {
      const advice = [];
  
      if (inputs.soilType === 'unknown') {
        advice.push('🔍 Get a soil test done immediately to improve recommendations');
      }
  
      if (inputs.soilTestReport === false && !inputs.soilType) {
        advice.push('📊 Visit a nearby soil testing lab for detailed soil report');
      }
  
      if (inputs.fertilizationHistory === 'excessive') {
        advice.push('⚠️ Reduce fertilizer usage gradually to avoid soil depletion');
      }
  
      if (inputs.waterAvailability === 'low') {
        advice.push('💧 Consider drip irrigation for better water management');
      }
  
      advice.push('📱 Regular monitoring of crop health is essential for success');
  
      return advice;
    }
  
    suggestCostOptimizations(crop, fertilizerPlan) {
      return [
        'Use organic manure to reduce chemical fertilizer costs',
        'Buy fertilizers in bulk with neighboring farmers for discounts',
        'Consider government schemes for fertilizer subsidies',
        'Alternate between chemical and organic fertilizers',
        'Practice soil conservation to reduce future fertilizer needs'
      ];
    }
  }
  
  module.exports = new RecommendationEngine();
