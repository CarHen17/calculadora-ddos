import React, { useState, useEffect } from 'react';
import { Calculator, Network, DollarSign, Clock, Wifi } from 'lucide-react';

const DDoSCostCalculator = () => {
  const [config, setConfig] = useState({
    contratoFixo: 500, // MB
    limiteBurst: 1500, // MB
    horasPermitidas: 36, // horas no mês
    custoExcesso: 5.81, // R$ por MB
    horasMes: 720 // total de horas no mês (30 dias * 24h)
  });

  const [usage, setUsage] = useState({
    consumoMedio: 400, // MB médio
    picoConsumo: 1200, // MB no pico
    horasPico: 20 // horas de pico no mês
  });

  const [resultado, setResultado] = useState({
    custoFixo: 0,
    custoExcesso: 0,
    custoTotal: 0,
    percentil95: 0,
    horasExcesso: 0,
    megasExcesso: 0
  });

  const calcular = () => {
    // Simula o cálculo do percentil 95%
    // 95% das horas devem estar dentro do limite de burst
    const horasPermitidas = config.horasPermitidas;
    const horasExcesso = Math.max(0, usage.horasPico - horasPermitidas);
    
    // Calcula o tráfego que excede o contrato fixo durante as horas de excesso
    let megasExcesso = 0;
    if (horasExcesso > 0) {
      const consumoExcesso = Math.max(0, usage.picoConsumo - config.contratoFixo);
      megasExcesso = consumoExcesso * horasExcesso;
    }
    
    // Calcula os custos
    const custoExcesso = megasExcesso * config.custoExcesso;
    const custoFixo = 0; // Assumindo que o custo fixo não está sendo calculado aqui
    const custoTotal = custoFixo + custoExcesso;
    
    // Calcula o percentil 95% simulado
    const percentil95 = usage.horasPico <= config.horasPermitidas ? 
      Math.max(usage.consumoMedio, config.contratoFixo) : 
      usage.picoConsumo;

    setResultado({
      custoFixo,
      custoExcesso,
      custoTotal,
      percentil95,
      horasExcesso,
      megasExcesso
    });
  };

  useEffect(() => {
    calcular();
  }, [config, usage]);

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleUsageChange = (field, value) => {
    setUsage(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Network className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Calculadora de Custo Link DDoS</h1>
          </div>
          <p className="text-gray-600">Cálculo baseado em Percentil 95% com burst permitido</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Configurações do Contrato */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Wifi className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Configurações do Contrato</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contrato Fixo (MB)
                </label>
                <input
                  type="number"
                  value={config.contratoFixo}
                  onChange={(e) => handleConfigChange('contratoFixo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Limite de Burst (MB)
                </label>
                <input
                  type="number"
                  value={config.limiteBurst}
                  onChange={(e) => handleConfigChange('limiteBurst', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horas Permitidas de Burst/Mês
                </label>
                <input
                  type="number"
                  value={config.horasPermitidas}
                  onChange={(e) => handleConfigChange('horasPermitidas', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custo por MB Excedente (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={config.custoExcesso}
                  onChange={(e) => handleConfigChange('custoExcesso', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total de Horas/Mês
                </label>
                <input
                  type="number"
                  value={config.horasMes}
                  onChange={(e) => handleConfigChange('horasMes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Uso Atual */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">Padrão de Uso</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Consumo Médio (MB)
                </label>
                <input
                  type="number"
                  value={usage.consumoMedio}
                  onChange={(e) => handleUsageChange('consumoMedio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pico de Consumo (MB)
                </label>
                <input
                  type="number"
                  value={usage.picoConsumo}
                  onChange={(e) => handleUsageChange('picoConsumo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horas de Pico/Mês
                </label>
                <input
                  type="number"
                  value={usage.horasPico}
                  onChange={(e) => handleUsageChange('horasPico', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mt-4">
                <h3 className="font-medium text-blue-800 mb-2">Como funciona:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 95% do tempo: até {config.limiteBurst}MB permitido</li>
                  <li>• 5% do tempo: pode exceder sem custo extra</li>
                  <li>• Máximo de {config.horasPermitidas}h/mês de burst</li>
                  <li>• Excesso cobra R$ {config.custoExcesso}/MB</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-800">Resultado do Cálculo</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Percentil 95%</div>
                <div className="text-2xl font-bold text-gray-800">{resultado.percentil95.toFixed(0)} MB</div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-sm text-yellow-700">Horas de Excesso</div>
                <div className="text-xl font-bold text-yellow-800">{resultado.horasExcesso.toFixed(0)} horas</div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-sm text-orange-700">MB Excedentes</div>
                <div className="text-xl font-bold text-orange-800">{resultado.megasExcesso.toFixed(0)} MB</div>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-sm text-red-700">Custo do Excesso</div>
                <div className="text-xl font-bold text-red-800">R$ {resultado.custoExcesso.toFixed(2)}</div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                <div className="text-sm text-blue-700">Custo Total Adicional</div>
                <div className="text-3xl font-bold text-blue-800">R$ {resultado.custoTotal.toFixed(2)}</div>
              </div>

              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">Status:</h3>
                <div className="text-sm text-green-700">
                  {resultado.horasExcesso === 0 ? 
                    "✅ Dentro do limite de burst permitido" : 
                    `⚠️ Excedendo em ${resultado.horasExcesso} horas/mês`
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-800">Explicação do Cálculo</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Lógica do Percentil 95%:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• O percentil 95% significa que 95% do tempo você pode usar até o limite de burst</li>
                <li>• Apenas 5% do tempo (≈36h/mês) é desconsiderado para cobrança</li>
                <li>• Se exceder mais de 36h/mês acima do contrato, paga o excesso</li>
                <li>• O cálculo considera apenas o tráfego acima do contrato fixo</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Exemplo Prático:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Contrato: 500MB fixo, burst até 1.5GB</li>
                <li>• Se usar 1.2GB por 20h/mês: sem custo extra</li>
                <li>• Se usar 1.2GB por 50h/mês: paga 14h × (1200-500)MB × R$5,81</li>
                <li>• Resultado: 14h × 700MB × R$5,81 = R$56.798</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DDoSCostCalculator;