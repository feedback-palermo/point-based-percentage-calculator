'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface RisultatiBase {
  punteggioA: string | null;
  punteggioB: string | null;
  errorA: boolean;
  errorB: boolean;
}

interface RisultatiDiff extends RisultatiBase {
  differenzaPercentuale: string | null;
}

const CalcolatoreOfferte = () => {
  const [operatoreA, setOperatoreA] = useState<string>('');
  const [operatoreB, setOperatoreB] = useState<string>('');
  const [risultati, setRisultati] = useState<RisultatiBase>({
    punteggioA: null,
    punteggioB: null,
    errorA: false,
    errorB: false
  });

  const [operatoreADiff, setOperatoreADiff] = useState<string>('');
  const [operatoreBDiff, setOperatoreBDiff] = useState<string>('');
  const [risultatiDiff, setRisultatiDiff] = useState<RisultatiDiff>({
    punteggioA: null,
    punteggioB: null,
    differenzaPercentuale: null,
    errorA: false,
    errorB: false
  });

  const calcolaPunteggio = (percentualeA: string, percentualeB: string): RisultatiBase => {
    const valoreA = parseFloat(percentualeA);
    const valoreB = parseFloat(percentualeB);
    
    if (isNaN(valoreA) || isNaN(valoreB)) {
      return {
        punteggioA: null,
        punteggioB: null,
        errorA: isNaN(valoreA),
        errorB: isNaN(valoreB)
      };
    }

    if (valoreA < 40 || valoreB < 40) {
      return {
        punteggioA: null,
        punteggioB: null,
        errorA: valoreA < 40,
        errorB: valoreB < 40
      };
    }

    const maxValore = Math.max(valoreA, valoreB);
    const punteggioA = (valoreA / maxValore) * 30;
    const punteggioB = (valoreB / maxValore) * 30;

    return {
      punteggioA: punteggioA.toFixed(2),
      punteggioB: punteggioB.toFixed(2),
      errorA: false,
      errorB: false
    };
  };

  const calcolaPunteggioDifferenza = (percentualeA: string, percentualeB: string): RisultatiDiff => {
    const valoreA = parseFloat(percentualeA);
    const valoreB = parseFloat(percentualeB);
    
    if (isNaN(valoreA) || isNaN(valoreB)) {
      return {
        punteggioA: null,
        punteggioB: null,
        differenzaPercentuale: null,
        errorA: isNaN(valoreA),
        errorB: isNaN(valoreB)
      };
    }

    if (valoreA < 40 || valoreB < 40) {
      return {
        punteggioA: null,
        punteggioB: null,
        differenzaPercentuale: null,
        errorA: valoreA < 40,
        errorB: valoreB < 40
      };
    }

    const minValore = Math.min(valoreA, valoreB);
    const maxValore = Math.max(valoreA, valoreB);
    const differenzaPercentuale = ((maxValore / minValore) - 1) * 100;

    let punteggioA, punteggioB;
    if (valoreA > valoreB) {
      punteggioA = 30;
      punteggioB = Math.max(0, 30 - (differenzaPercentuale / 2));
    } else if (valoreB > valoreA) {
      punteggioB = 30;
      punteggioA = Math.max(0, 30 - (differenzaPercentuale / 2));
    } else {
      punteggioA = 30;
      punteggioB = 30;
    }

    return {
      punteggioA: Math.max(0, punteggioA).toFixed(2),
      punteggioB: Math.max(0, punteggioB).toFixed(2),
      differenzaPercentuale: differenzaPercentuale.toFixed(2),
      errorA: false,
      errorB: false
    };
  };

  useEffect(() => {
    const risultati = calcolaPunteggio(operatoreA, operatoreB);
    setRisultati(risultati);
  }, [operatoreA, operatoreB]);

  useEffect(() => {
    const risultatiDiff = calcolaPunteggioDifferenza(operatoreADiff, operatoreBDiff);
    setRisultatiDiff(risultatiDiff);
  }, [operatoreADiff, operatoreBDiff]);

  const renderCalcolatore = (
    titolo: string,
    operatoreA: string,
    operatoreB: string,
    setOperatoreA: (value: string) => void,
    setOperatoreB: (value: string) => void,
    risultatiCalcolo: RisultatiBase | RisultatiDiff,
    mostraDifferenza: boolean = false
  ) => (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center mb-4">
          {titolo}
        </CardTitle>
        {titolo.includes("Proporzionale") ? (
          <p className="text-gray-600 text-sm">
            Questo metodo calcola i punteggi in modo direttamente proporzionale al rapporto tra le percentuali offerte. 
            L&apos;offerta più alta riceve 30 punti, mentre l&apos;altra offerta riceve un punteggio proporzionalmente ridotto 
            in base al rapporto tra le due percentuali (es: se un&apos;offerta è del 40% e l&apos;altra del 80%, la prima riceverà 15 punti).
          </p>
        ) : (
          <p className="text-gray-600 text-sm">
            Questo metodo calcola i punteggi basandosi sulla differenza percentuale tra le due offerte. 
            L&apos;offerta più alta riceve sempre 30 punti, mentre l&apos;offerta più bassa viene penalizzata in base 
            alla differenza percentuale tra le due offerte. La penalizzazione è pari alla metà della differenza percentuale 
            (es: con una differenza del 10%, l&apos;offerta più bassa riceve 25 punti).
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Percentuale Operatore A
              </label>
              <input
                type="number"
                value={operatoreA}
                onChange={(e) => setOperatoreA(e.target.value)}
                className="w-full p-2 border rounded"
                min="40"
                step="0.01"
                placeholder="Inserisci percentuale"
              />
              {risultatiCalcolo.errorA && (
                <p className="text-red-500 text-sm mt-1">
                  La percentuale deve essere ≥ 40%
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Percentuale Operatore B
              </label>
              <input
                type="number"
                value={operatoreB}
                onChange={(e) => setOperatoreB(e.target.value)}
                className="w-full p-2 border rounded"
                min="40"
                step="0.01"
                placeholder="Inserisci percentuale"
              />
              {risultatiCalcolo.errorB && (
                <p className="text-red-500 text-sm mt-1">
                  La percentuale deve essere ≥ 40%
                </p>
              )}
            </div>
          </div>

          {risultatiCalcolo.punteggioA !== null && risultatiCalcolo.punteggioB !== null && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Risultati:</h3>
              {mostraDifferenza && 'differenzaPercentuale' in risultatiCalcolo && risultatiCalcolo.differenzaPercentuale !== null && (
                <div className="p-4 bg-yellow-50 rounded mb-4">
                  <p className="font-medium">
                    Differenza percentuale tra le offerte: {risultatiCalcolo.differenzaPercentuale}%
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded">
                  <p className="font-medium">Operatore A</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {risultatiCalcolo.punteggioA} punti
                  </p>
                  <p className="text-sm text-gray-600">
                    Percentuale offerta: {operatoreA}%
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="font-medium">Operatore B</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {risultatiCalcolo.punteggioB} punti
                  </p>
                  <p className="text-sm text-gray-600">
                    Percentuale offerta: {operatoreB}%
                  </p>
                </div>
              </div>
            </div>
          )}

          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Le offerte con percentuale inferiore al 40% verranno automaticamente escluse.
              Il punteggio massimo ottenibile è 30 punti.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {renderCalcolatore(
        "Calcolatore Punteggi - Metodo Proporzionale ✓ (Metodo del Bando)",
        operatoreA,
        operatoreB,
        setOperatoreA,
        setOperatoreB,
        risultati
      )}
      {renderCalcolatore(
        "Calcolatore Punteggi - Metodo Differenza Percentuale (Riferimento)",
        operatoreADiff,
        operatoreBDiff,
        setOperatoreADiff,
        setOperatoreBDiff,
        risultatiDiff,
        true
      )}
    </div>
  );
};

const Page = () => {
  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">
        Calcolatore Punteggi Offerte
      </h1>
      <CalcolatoreOfferte />
    </div>
  );
};

export default Page;