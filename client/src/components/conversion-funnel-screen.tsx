'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChevronDown } from 'lucide-react';

const funnelSteps = [
  { step: 'Visitors', count: 50000, dropOff: 0, color: 'bg-blue-500' },
  { step: 'Registered Users', count: 12500, dropOff: 75, color: 'bg-blue-600' },
  { step: 'Added to Cart', count: 6250, dropOff: 50, color: 'bg-blue-700' },
  { step: 'Checkout Started', count: 3750, dropOff: 40, color: 'bg-blue-800' },
  { step: 'Payment Success', count: 2625, dropOff: 30, color: 'bg-blue-900' },
];

export function ConversionFunnelScreen() {
  return (
    <div className="space-y-6">
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Conversion Funnel Analysis</CardTitle>
          <p className="text-sm text-gray-500 mt-2">
            Track user journey from initial visit to successful payment
          </p>
        </CardHeader>
        <CardContent>
          <div className="max-w-2xl mx-auto">
            <div className="space-y-3">
              {funnelSteps.map((step, index) => {
                const widthPercentage = 100 - index * 15;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`${step.color} text-white rounded-lg py-6 px-8 transition-all hover:scale-105 cursor-pointer shadow-md`}
                      style={{ width: `${widthPercentage}%` }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm opacity-90">{step.step}</p>
                          <p className="text-2xl font-semibold mt-1">{step.count.toLocaleString()}</p>
                        </div>
                        {step.dropOff > 0 && (
                          <div className="text-right">
                            <p className="text-xs opacity-75">Drop-off</p>
                            <p className="text-lg font-semibold">-{step.dropOff}%</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {index < funnelSteps.length - 1 && (
                      <ChevronDown className="w-6 h-6 text-gray-400 my-1" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Overall Conversion</p>
                  <p className="text-2xl font-semibold text-blue-600 mt-1">5.25%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Drop-off per Step</p>
                  <p className="text-2xl font-semibold text-blue-600 mt-1">48.75%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Steps</p>
                  <p className="text-2xl font-semibold text-blue-600 mt-1">5</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-6 text-center">
              Derived from user journey events
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-base">Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm">
                    Largest drop-off occurs between Visitors and Registered Users (75%)
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm">
                    Cart abandonment rate is 40% (Checkout Started vs Added to Cart)
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm">
                    Payment success rate is 70% once checkout is initiated
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-base">Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm">
                    Simplify registration process to reduce friction
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm">
                    Add email recovery campaigns for abandoned carts
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm">
                    Optimize checkout flow to minimize payment failures
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}