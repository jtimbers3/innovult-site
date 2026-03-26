param(
  [Parameter(Mandatory=$true)][string]$Query,
  [ValidateSet('basic','advanced')][string]$SearchDepth = 'advanced',
  [int]$MaxResults = 5,
  [switch]$IncludeAnswer,
  [switch]$IncludeRawContent
)

$apiKey = $env:TAVILY_API_KEY
if (-not $apiKey) {
  Write-Error "TAVILY_API_KEY is not set. Set it first: `$env:TAVILY_API_KEY='tvly-...'")
  exit 1
}

$body = @{
  query = $Query
  search_depth = $SearchDepth
  max_results = $MaxResults
  include_answer = [bool]$IncludeAnswer
  include_raw_content = [bool]$IncludeRawContent
}

try {
  $response = Invoke-RestMethod \
    -Method Post \
    -Uri 'https://api.tavily.com/search' \
    -ContentType 'application/json' \
    -Body (($body + @{ api_key = $apiKey }) | ConvertTo-Json -Depth 6)

  $response | ConvertTo-Json -Depth 10
}
catch {
  Write-Error "Tavily request failed: $($_.Exception.Message)"
  if ($_.ErrorDetails.Message) {
    Write-Error "API response: $($_.ErrorDetails.Message)"
  }
  exit 1
}
