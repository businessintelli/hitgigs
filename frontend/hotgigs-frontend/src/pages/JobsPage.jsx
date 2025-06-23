import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MapPin, Filter } from 'lucide-react'

const JobsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Next Job</h1>
          
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Job title, keywords, or company"
                    className="pl-10 h-12"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Location"
                    className="pl-10 h-12"
                  />
                </div>
              </div>
              <Button className="h-12 px-8">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
              <Button variant="outline" className="h-12">
                <Filter className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Jobs Page Coming Soon</h2>
          <p className="text-gray-600">
            This page will display job listings with advanced search and filtering capabilities.
          </p>
        </div>
      </div>
    </div>
  )
}

export default JobsPage

