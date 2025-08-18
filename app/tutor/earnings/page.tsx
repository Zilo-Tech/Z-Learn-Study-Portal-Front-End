"use client";

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Download, 
  Filter,
  CreditCard,
  PiggyBank,
  Wallet,
  BarChart3,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface EarningsData {
  total_earnings: number;
  monthly_earnings: number;
  pending_payments: number;
  last_payout: number;
  earnings_growth: number;
  sessions_this_month: number;
  hourly_rate: number;
  transactions: Array<{
    id: number;
    date: string;
    amount: number;
    type: 'session' | 'payout' | 'refund';
    status: 'completed' | 'pending' | 'failed';
    student_name?: string;
    session_subject?: string;
  }>;
  monthly_breakdown: Array<{
    month: string;
    earnings: number;
    sessions: number;
  }>;
}

export default function TutorEarningsPage() {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [filterType, setFilterType] = useState<'all' | 'session' | 'payout' | 'refund'>('all');

  const fetchEarnings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tutor/earnings/?period=${timeRange}`);
      setEarnings(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching earnings:', err);
      setError('Failed to load earnings data');
      // Mock data for development
      setEarnings({
        total_earnings: 4250.75,
        monthly_earnings: 850.50,
        pending_payments: 125.25,
        last_payout: 725.25,
        earnings_growth: 12.5,
        sessions_this_month: 34,
        hourly_rate: 25.00,
        transactions: [
          {
            id: 1,
            date: '2024-01-12T10:00:00Z',
            amount: 50.00,
            type: 'session',
            status: 'completed',
            student_name: 'Alice Johnson',
            session_subject: 'Mathematics'
          },
          {
            id: 2,
            date: '2024-01-11T15:30:00Z',
            amount: 37.50,
            type: 'session',
            status: 'completed',
            student_name: 'Bob Smith',
            session_subject: 'Physics'
          },
          {
            id: 3,
            date: '2024-01-10T09:00:00Z',
            amount: 500.00,
            type: 'payout',
            status: 'completed'
          },
          {
            id: 4,
            date: '2024-01-09T14:00:00Z',
            amount: 25.00,
            type: 'session',
            status: 'pending',
            student_name: 'Carol Davis',
            session_subject: 'Chemistry'
          },
          {
            id: 5,
            date: '2024-01-08T11:30:00Z',
            amount: -12.50,
            type: 'refund',
            status: 'completed',
            student_name: 'David Wilson'
          }
        ],
        monthly_breakdown: [
          { month: 'Jan 2024', earnings: 850.50, sessions: 34 },
          { month: 'Dec 2023', earnings: 756.25, sessions: 31 },
          { month: 'Nov 2023', earnings: 680.75, sessions: 28 },
          { month: 'Oct 2023', earnings: 720.50, sessions: 29 },
          { month: 'Sep 2023', earnings: 642.25, sessions: 26 }
        ]
      });
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'session':
        return DollarSign;
      case 'payout':
        return Wallet;
      case 'refund':
        return ArrowDownRight;
      default:
        return DollarSign;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-600';
      case 'pending':
        return 'text-amber-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredTransactions = earnings?.transactions.filter(transaction => {
    return filterType === 'all' || transaction.type === filterType;
  }) || [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <DollarSign className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
            <p className="text-gray-600">Track your income and payouts</p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!earnings) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <DollarSign className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
            <p className="text-gray-600">Track your income and payouts</p>
          </div>
        </div>
        
        <Card className="p-12 text-center">
          <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No earnings data available</h3>
          <p className="text-gray-500">Start tutoring sessions to see your earnings</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <DollarSign className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
            <p className="text-gray-600">Track your income and payouts</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'quarter' | 'year')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(earnings.total_earnings)}</p>
              <div className="flex items-center text-sm text-emerald-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+{earnings.earnings_growth}% this month</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(earnings.monthly_earnings)}</p>
              <p className="text-xs text-gray-500 mt-1">{earnings.sessions_this_month} sessions</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(earnings.pending_payments)}</p>
              <p className="text-xs text-gray-500 mt-1">Awaiting payout</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Wallet className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Last Payout</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(earnings.last_payout)}</p>
              <p className="text-xs text-gray-500 mt-1">Previous payment</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Hourly Rate</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(earnings.hourly_rate)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <PiggyBank className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. per Session</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(earnings.monthly_earnings / earnings.sessions_this_month)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Platform Fee</p>
              <p className="text-xl font-bold text-gray-900">15%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Earnings Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Breakdown</h3>
          <BarChart3 className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="space-y-4">
          {earnings.monthly_breakdown.map((month) => {
            const maxEarnings = Math.max(...earnings.monthly_breakdown.map(m => m.earnings));
            const percentage = (month.earnings / maxEarnings) * 100;
            
            return (
              <div key={month.month} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{month.month}</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(month.earnings)}</span>
                    <span className="text-xs text-gray-500 ml-2">({month.sessions} sessions)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Transaction History */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          
          <div className="flex items-center space-x-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'session' | 'payout' | 'refund')}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Types</option>
              <option value="session">Sessions</option>
              <option value="payout">Payouts</option>
              <option value="refund">Refunds</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => {
            const Icon = getTransactionIcon(transaction.type);
            const isNegative = transaction.amount < 0;
            
            return (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'session' ? 'bg-emerald-100' :
                    transaction.type === 'payout' ? 'bg-blue-100' :
                    'bg-red-100'
                  }`}>
                    <Icon className={`h-4 w-4 ${
                      transaction.type === 'session' ? 'text-emerald-600' :
                      transaction.type === 'payout' ? 'text-blue-600' :
                      'text-red-600'
                    }`} />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900 capitalize">{transaction.type}</p>
                      <span className={`text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      {transaction.student_name && (
                        <span>with {transaction.student_name}</span>
                      )}
                      {transaction.session_subject && (
                        <span> • {transaction.session_subject}</span>
                      )}
                      <span className="ml-2">{formatDate(transaction.date)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-bold ${
                    isNegative ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {isNegative ? '-' : '+'}{formatCurrency(Math.abs(transaction.amount))}
                  </p>
                  
                  {transaction.status === 'completed' && (
                    <div className="flex items-center justify-end text-emerald-600 mt-1">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      <span className="text-xs">Completed</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Payout Information */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Payout Information</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Payouts are processed weekly on Fridays</li>
          <li>• Minimum payout amount is $50</li>
          <li>• Funds typically arrive in 2-3 business days</li>
          <li>• Platform fee of 15% is deducted from each session</li>
        </ul>
      </Card>
    </div>
  );
}