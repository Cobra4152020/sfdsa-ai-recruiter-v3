"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  databaseSchemaVerification,
  verifySchema,
  fixAllIssues,
  fixTableIssuesAction,
  fixSpecificIssues,
  runCustomFix,
} from "@/lib/actions/database-schema-verification"
import type { SchemaVerificationResult } from "@/lib/schema-verification"
import { AlertCircle, CheckCircle, XCircle, Database, Table, RefreshCw, Code, Wrench, FileText, CheckCircle2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { SchemaDiagram } from "./schema-diagram"

export function SchemaVerificationTool() {
  const [verificationResult, setVerificationResult] = useState<SchemaVerificationResult | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isFixing, setIsFixing] = useState(false)
  const [selectedIssues, setSelectedIssues] = useState<number[]>([])
  const [customSql, setCustomSql] = useState("")
  const [activeTab, setActiveTab] = useState("verification")
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  // Run verification on component mount
  useEffect(() => {
    verifyDatabaseSchema()
  }, [])

  // Verify database schema
  const verifyDatabaseSchema = async () => {
    setIsVerifying(true)
    try {
      const result = await verifySchema()
      setVerificationResult(result)
    } catch (error) {
      console.error("Error verifying database schema:", error)
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  // Fix all issues
  const handleFixAllIssues = async () => {
    try {
      setIsFixing(true)
      const result = await fixAllIssues()

      if (result.success) {
        toast({
          title: "Issues Fixed",
          description: `Successfully fixed ${result.fixed.length} issues`,
          variant: "default",
        })

        // Re-verify schema
        await verifyDatabaseSchema()
      } else {
        toast({
          title: "Fix Failed",
          description: result.error || "Failed to fix issues",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fixing all issues:", error)
      toast({
        title: "Fix Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsFixing(false)
    }
  }

  // Fix issues for a specific table
  const handleFixTableIssues = async (tableName: string) => {
    try {
      setIsFixing(true)
      const result = await fixTableIssuesAction(tableName)

      if (result.success) {
        toast({
          title: "Table Issues Fixed",
          description: `Successfully fixed ${result.fixed.length} issues for table ${tableName}`,
          variant: "default",
        })

        // Re-verify schema
        await verifyDatabaseSchema()
      } else {
        toast({
          title: "Fix Failed",
          description: result.error || `Failed to fix issues for table ${tableName}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(`Error fixing issues for table ${tableName}:`, error)
      toast({
        title: "Fix Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsFixing(false)
    }
  }

  // Fix selected issues
  const handleFixSelectedIssues = async () => {
    if (selectedIssues.length === 0) {
      toast({
        title: "No Issues Selected",
        description: "Please select at least one issue to fix",
        variant: "default",
      })
      return
    }

    try {
      setIsFixing(true)
      const result = await fixSpecificIssues(selectedIssues)

      if (result.success) {
        toast({
          title: "Selected Issues Fixed",
          description: `Successfully fixed ${result.fixed.length} issues`,
          variant: "default",
        })

        // Re-verify schema
        await verifyDatabaseSchema()

        // Clear selection
        setSelectedIssues([])
      } else {
        toast({
          title: "Fix Failed",
          description: result.error || "Failed to fix selected issues",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fixing selected issues:", error)
      toast({
        title: "Fix Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsFixing(false)
    }
  }

  // Run custom SQL
  const handleRunCustomSql = async () => {
    if (!customSql.trim()) {
      toast({
        title: "No SQL Provided",
        description: "Please enter SQL to run",
        variant: "default",
      })
      return
    }

    try {
      setIsFixing(true)
      const result = await runCustomFix(customSql)

      if (result.success) {
        toast({
          title: "Custom SQL Executed",
          description: "Successfully executed custom SQL",
          variant: "default",
        })

        // Re-verify schema
        await verifyDatabaseSchema()

        // Clear SQL
        setCustomSql("")
      } else {
        toast({
          title: "Execution Failed",
          description: result.error || "Failed to execute custom SQL",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error executing custom SQL:", error)
      toast({
        title: "Execution Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsFixing(false)
    }
  }

  // Toggle issue selection
  const toggleIssueSelection = (index: number) => {
    if (selectedIssues.includes(index)) {
      setSelectedIssues(selectedIssues.filter((i) => i !== index))
    } else {
      setSelectedIssues([...selectedIssues, index])
    }
  }

  // Count total issues
  const countTotalIssues = () => {
    if (!verificationResult) return 0

    const globalIssuesCount = verificationResult.globalIssues.length
    const tableIssuesCount = verificationResult.tables.reduce((count, table) => count + table.issues.length, 0)

    return globalIssuesCount + tableIssuesCount
  }

  // Get severity badge
  const getSeverityBadge = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return (
          <Badge variant="default" className="bg-amber-500">
            Medium
          </Badge>
        )
      case "low":
        return <Badge variant="outline">Low</Badge>
    }
  }

  // Render issue type icon
  const getIssueTypeIcon = (type: string) => {
    switch (type) {
      case "missing_table":
        return <Database className="h-4 w-4 text-red-500" />
      case "missing_column":
        return <Table className="h-4 w-4 text-amber-500" />
      case "invalid_constraint":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "missing_constraint":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const handleVerify = async () => {
    setIsLoading(true)
    try {
      const result = await databaseSchemaVerification({})
      setResult(result)
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Database Schema Verification Tool</h1>
        <Button onClick={handleVerify} disabled={isLoading} variant="outline">
          {isLoading ? "Verifying..." : "Verify Schema"}
        </Button>
      </div>

      {result && (
        <Alert variant={result.success ? "default" : "destructive"}>
          {result.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="verification">Verification Results</TabsTrigger>
          <TabsTrigger value="fixes">Fix Issues</TabsTrigger>
          <TabsTrigger value="custom">Custom SQL</TabsTrigger>
          <TabsTrigger value="diagram">
            <FileText className="mr-2 h-4 w-4" />
            Schema Diagram
          </TabsTrigger>
        </TabsList>

        <TabsContent value="verification" className="space-y-4">
          {verificationResult ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Schema Verification Summary</span>
                    {countTotalIssues() === 0 ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        <CheckCircle className="mr-1 h-4 w-4" /> No Issues
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertCircle className="mr-1 h-4 w-4" /> {countTotalIssues()} Issues
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>Verification completed at {new Date().toLocaleTimeString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  {verificationResult.error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{verificationResult.error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Global Issues */}
                  {verificationResult.globalIssues.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium mb-2">Global Issues</h3>
                      <ul className="space-y-2">
                        {verificationResult.globalIssues.map((issue, index) => (
                          <li key={index} className="border rounded-md p-3">
                            <div className="flex items-start">
                              <div className="mr-2 mt-0.5">{getIssueTypeIcon(issue.type)}</div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{issue.description}</span>
                                  {getSeverityBadge(issue.severity)}
                                </div>
                                {issue.fixed && (
                                  <Badge variant="outline" className="bg-green-100 text-green-800 mt-1">
                                    Fixed
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tables */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Tables</h3>
                    <div className="space-y-4">
                      {verificationResult.tables.map((table, tableIndex) => (
                        <Card key={tableIndex}>
                          <CardHeader className="py-3">
                            <CardTitle className="text-base flex items-center justify-between">
                              <span className="flex items-center">
                                <Table className="mr-2 h-4 w-4" />
                                {table.table_name}
                              </span>
                              {table.exists ? (
                                <Badge variant="outline" className="bg-green-100 text-green-800">
                                  <CheckCircle className="mr-1 h-4 w-4" /> Exists
                                </Badge>
                              ) : (
                                <Badge variant="destructive">
                                  <XCircle className="mr-1 h-4 w-4" /> Missing
                                </Badge>
                              )}
                            </CardTitle>
                          </CardHeader>
                          {table.issues.length > 0 && (
                            <CardContent className="py-0">
                              <h4 className="text-sm font-medium mb-2">Issues</h4>
                              <ul className="space-y-2">
                                {table.issues.map((issue, issueIndex) => (
                                  <li key={issueIndex} className="border rounded-md p-2 text-sm">
                                    <div className="flex items-start">
                                      <div className="mr-2 mt-0.5">{getIssueTypeIcon(issue.type)}</div>
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                          <span className="font-medium">{issue.description}</span>
                                          {getSeverityBadge(issue.severity)}
                                        </div>
                                        {issue.fixed && (
                                          <Badge variant="outline" className="bg-green-100 text-green-800 mt-1">
                                            Fixed
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          )}
                          {table.exists && table.issues.length === 0 && (
                            <CardContent className="py-2">
                              <div className="text-sm text-green-600 flex items-center">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                No issues detected
                              </div>
                            </CardContent>
                          )}
                          {table.exists && table.issues.length > 0 && (
                            <CardFooter className="py-2">
                              <Button
                                size="sm"
                                onClick={() => handleFixTableIssues(table.table_name)}
                                disabled={isFixing}
                              >
                                <Wrench className="mr-1 h-4 w-4" />
                                Fix Table Issues
                              </Button>
                            </CardFooter>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {countTotalIssues() > 0 && (
                    <Button onClick={handleFixAllIssues} disabled={isFixing} className="w-full">
                      <Wrench className="mr-2 h-4 w-4" />
                      {isFixing ? "Fixing Issues..." : `Fix All Issues (${countTotalIssues()})`}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-center items-center h-40">
                  {isVerifying ? (
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                      <p>Verifying database schema...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Database className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                      <p>No verification results available</p>
                      <Button onClick={verifyDatabaseSchema} variant="outline" className="mt-4">
                        Verify Schema
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="fixes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fix Selected Issues</CardTitle>
              <CardDescription>Select specific issues to fix from the list below</CardDescription>
            </CardHeader>
            <CardContent>
              {verificationResult ? (
                <>
                  {countTotalIssues() === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-8 w-8 mx-auto mb-4 text-green-500" />
                      <p>No issues detected in the database schema</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Global Issues */}
                      {verificationResult.globalIssues.length > 0 && (
                        <div>
                          <h3 className="text-md font-medium mb-2">Global Issues</h3>
                          <ul className="space-y-2">
                            {verificationResult.globalIssues.map((issue, index) => (
                              <li key={index} className="border rounded-md p-3">
                                <div className="flex items-start">
                                  <input
                                    type="checkbox"
                                    id={`global-issue-${index}`}
                                    checked={selectedIssues.includes(index)}
                                    onChange={() => toggleIssueSelection(index)}
                                    className="mr-3 mt-1"
                                  />
                                  <div className="flex-1">
                                    <label
                                      htmlFor={`global-issue-${index}`}
                                      className="flex items-center justify-between cursor-pointer"
                                    >
                                      <span className="font-medium">{issue.description}</span>
                                      {getSeverityBadge(issue.severity)}
                                    </label>
                                    {issue.fixSql && (
                                      <div className="mt-2">
                                        <div className="text-xs bg-gray-100 p-2 rounded-md overflow-x-auto">
                                          <pre>{issue.fixSql}</pre>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Table Issues */}
                      {verificationResult.tables.map(
                        (table, tableIndex) =>
                          table.issues.length > 0 && (
                            <div key={tableIndex}>
                              <h3 className="text-md font-medium mb-2">Table: {table.table_name}</h3>
                              <ul className="space-y-2">
                                {table.issues.map((issue, issueIndex) => {
                                  const globalIssuesCount = verificationResult.globalIssues.length
                                  const previousTablesIssuesCount = verificationResult.tables
                                    .slice(0, tableIndex)
                                    .reduce((count, t) => count + t.issues.length, 0)
                                  const absoluteIndex = globalIssuesCount + previousTablesIssuesCount + issueIndex

                                  return (
                                    <li key={issueIndex} className="border rounded-md p-3">
                                      <div className="flex items-start">
                                        <input
                                          type="checkbox"
                                          id={`table-${tableIndex}-issue-${issueIndex}`}
                                          checked={selectedIssues.includes(absoluteIndex)}
                                          onChange={() => toggleIssueSelection(absoluteIndex)}
                                          className="mr-3 mt-1"
                                        />
                                        <div className="flex-1">
                                          <label
                                            htmlFor={`table-${tableIndex}-issue-${issueIndex}`}
                                            className="flex items-center justify-between cursor-pointer"
                                          >
                                            <span className="font-medium">{issue.description}</span>
                                            {getSeverityBadge(issue.severity)}
                                          </label>
                                          {issue.fixSql && (
                                            <div className="mt-2">
                                              <div className="text-xs bg-gray-100 p-2 rounded-md overflow-x-auto">
                                                <pre>{issue.fixSql}</pre>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </li>
                                  )
                                })}
                              </ul>
                            </div>
                          ),
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Database className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                  <p>No verification results available</p>
                  <Button onClick={verifyDatabaseSchema} variant="outline" className="mt-4">
                    Verify Schema
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleFixSelectedIssues}
                disabled={isFixing || selectedIssues.length === 0}
                className="w-full"
              >
                <Wrench className="mr-2 h-4 w-4" />
                {isFixing ? "Fixing Issues..." : `Fix Selected Issues (${selectedIssues.length})`}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom SQL Fix</CardTitle>
              <CardDescription>Write custom SQL to fix database schema issues</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={customSql}
                onChange={(e) => setCustomSql(e.target.value)}
                placeholder="-- Enter your SQL here
ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check;
ALTER TABLE user_roles ADD CONSTRAINT user_roles_role_check 
CHECK (role IN ('recruit', 'volunteer', 'admin'));"
                className="font-mono h-64"
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleRunCustomSql} disabled={isFixing || !customSql.trim()} className="w-full">
                <Code className="mr-2 h-4 w-4" />
                {isFixing ? "Executing SQL..." : "Execute SQL"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="diagram" className="space-y-4">
          <SchemaDiagram />
        </TabsContent>
      </Tabs>
    </div>
  )
}
