$ErrorActionPreference = 'SilentlyContinue'

$dashboardPath = 'C:\Users\jtimb\.openclaw\workspace\Innovult-Recruiting-Dashboard.html'
$desktopDashboardPath = 'C:\Users\jtimb\Desktop\Innovult-Recruiting-Dashboard.html'

$jobs = @(
  @{Id='J001';Title='Oracle ERP Cloud Project Manager';Company='CorpToCorp listing';Location='Remote + travel';Contract='Hourly C2C (explicit)';Score=88;Source='https://corptocorp.org/job/oracle-c2c-jobs-miami-fl-15184-oracle-erp-cloud-project-manager-contract-jobs-remote-role/'},
  @{Id='J002';Title='Oracle ERP/EPM Project Manager';Company='CorpToCorp listing';Location='Remote/NJ hybrid note';Contract='Contract (explicit)';Score=85;Source='https://corptocorp.org/oracle-erp-epm-project-manager-contract-role/'},
  @{Id='J003';Title='Workday Financial Integration Lead';Company='CorpToCorp listing';Location='NYC hybrid';Contract='$55–60/hr C2C (explicit)';Score=84;Source='https://corptocorp.org/job/oracle-c2c-jobs-nyc-ny-15184-workday-financial-integration-lead-contract-c2c-jobs-urgent-need/'},
  @{Id='J004';Title='SAP FICO Consultant';Company='CorpToCorp listing';Location='Roswell, GA remote/travel';Contract='Contract (explicit)';Score=81;Source='https://corptocorp.org/job/c2c-jobs-roswell-ga-15184-sap-fico-consultant-contract-jobs-in-roswell-ga/'},
  @{Id='J005';Title='SAP FICO (Rahway)';Company='CorpToCorp listing';Location='Rahway, NJ hybrid';Contract='Long-term contract (explicit)';Score=79;Source='https://corptocorp.org/job/sap-c2c-requirements-rahway-nj-15184-sap-fico-c2c-requirements-rahway-nj-onsite-long-term-contract/'},
  @{Id='J006';Title='Oracle ERP Test Manager';Company='CorpToCorp listing';Location='Houston onsite';Contract='$65/hr C2C (explicit)';Score=77;Source='https://corptocorp.org/job/c2c-requirements-houston-tx-15184-qa-oracle-erp-tester-c2c-jobs-urgent-need/'},
  @{Id='J007';Title='IT Project Manager - ERP';Company='The Carrera Agency';Location='Irvine, CA';Contract='Possible/unclear';Score=68;Source='https://www.linkedin.com/jobs/search/?keywords=ERP%20Project%20Manager%20Contract%20C2C&location=United%20States'},
  @{Id='J008';Title='Informatica Sage 500 ERP Integration Consultant';Company='Blue Star Partners';Location='Columbus, OH';Contract='Possible/unclear';Score=70;Source='https://www.linkedin.com/jobs/search/?keywords=ERP%20Project%20Manager%20Contract%20C2C&location=United%20States'},
  @{Id='J009';Title='Workday FIN Advisory Consultant';Company='Medasource';Location='United States';Contract='Possible/unclear';Score=67;Source='https://www.linkedin.com/jobs/search/?keywords=Workday%20Financials%20Contract&location=United%20States'},
  @{Id='J010';Title='Senior Test Lead — Workday ERP (Public Sector Financials)';Company='Subtle Scale';Location='United States';Contract='Possible/unclear';Score=72;Source='https://www.linkedin.com/jobs/search/?keywords=Workday%20Financials%20Contract&location=United%20States'},
  @{Id='J011';Title='Workday System Analyst - Financials & PSA';Company='Elliott Davis';Location='United States / NC / SC / TN';Contract='Possible/unclear';Score=74;Source='https://www.linkedin.com/jobs/search/?keywords=Workday%20Financials%20Contract&location=United%20States'},
  @{Id='J012';Title='Workday Financials Support Analyst';Company='Kforce Inc';Location='Grand Rapids, MI';Contract='Possible/unclear';Score=71;Source='https://www.linkedin.com/jobs/search/?keywords=Workday%20Financials%20Contract&location=United%20States'},
  @{Id='J013';Title='Workday Financials Consultant(s)- All Levels';Company='Peoplevisor';Location='Irving, TX';Contract='Possible/unclear';Score=69;Source='https://www.linkedin.com/jobs/search/?keywords=Workday%20Financials%20Contract&location=United%20States'}
)

$candidates = @(
  @{Id='C001';Name='Amit K.';Current='SAP Technical Consultant';Skills='SAP ABAP/FIORI, FI, SD, MM';Platform='SAP';Source='https://www.freelancer.com/u/amitkstaiping'},
  @{Id='C002';Name='Chinmay S.';Current='SAP Basis Consultant';Skills='S/4HANA, NetWeaver, migrations';Platform='SAP';Source='https://www.freelancer.com/u/chinmaynewyork'},
  @{Id='C003';Name='Pushpendra M.';Current='D365 Business Central Expert';Skills='D365 BC, Power BI, ERP integration';Platform='Microsoft ERP';Source='https://www.freelancer.com/u/Allgrow'},
  @{Id='C004';Name='Limited-data Oracle profile';Current='Consultant';Skills='Oracle Apps/Fusion, SAP, BI';Platform='Oracle/SAP';Source='https://www.freelancer.com/freelancers/skills/oracle'}
)

function Get-RateInfo([string]$content){
  if(-not $content){ return 'Not listed' }
  $patterns = @(
    '\$\s?\d+\s?(?:-|–|to)\s?\$?\d+\s?/?\s?(?:hr|hour|phr)',
    '\$\s?\d+\s?/?\s?(?:hr|hour|phr)'
  )
  foreach($p in $patterns){
    $m = [regex]::Match($content, $p, 'IgnoreCase')
    if($m.Success){ return ($m.Value -replace '\s+',' ').Trim() }
  }
  return 'Not listed'
}

foreach($j in $jobs){
  $resp = Invoke-WebRequest -Uri $j.Source -TimeoutSec 20
  if($resp -and $resp.Content){
    $j.Rate = Get-RateInfo $resp.Content
    $j.SourceStatus = 'Reachable'
  } else {
    $j.Rate = 'Not listed'
    $j.SourceStatus = 'Unavailable'
  }
}

foreach($c in $candidates){
  $resp = Invoke-WebRequest -Uri $c.Source -TimeoutSec 20
  if($resp -and $resp.Content){ $c.Status='Reachable' } else { $c.Status='Unavailable' }
}

$generated = (Get-Date).ToString('yyyy-MM-dd h:mm tt') + ' ET'

$jobRows = ($jobs | ForEach-Object {
  "<tr><td>$($_.Id)</td><td>$($_.Title)</td><td>$($_.Company)</td><td>$($_.Location)</td><td>$($_.Rate)</td><td>$($_.Contract)</td><td>$($_.Score)</td><td><a href='$($_.Source)'>Source</a> <span class='pill'>$($_.SourceStatus)</span></td></tr>"
}) -join "`n"

$candidateRows = ($candidates | ForEach-Object {
  "<tr><td>$($_.Id)</td><td>$($_.Name)</td><td>$($_.Current)</td><td>$($_.Skills)</td><td>$($_.Platform)</td><td><a href='$($_.Source)'>Source</a> <span class='pill'>$($_.Status)</span></td></tr>"
}) -join "`n"

$html = @"
<!doctype html>
<html>
<head>
  <meta charset='utf-8' />
  <title>Innovult Recruiting & BD Dashboard</title>
  <style>
    body{font-family:Segoe UI,Arial,sans-serif;background:#0b1020;color:#e8ecf4;margin:0;padding:24px}
    h1,h2{margin:0 0 10px}.muted{color:#9fb0d0}
    .card{background:#121a33;border:1px solid #243055;border-radius:12px;padding:16px;margin:14px 0}
    table{width:100%;border-collapse:collapse;font-size:13px}
    th,td{border-bottom:1px solid #263455;padding:8px;vertical-align:top}
    th{color:#9fc3ff;text-align:left} a{color:#8ec5ff}
    .pill{display:inline-block;padding:2px 8px;border-radius:999px;background:#1f2c50;border:1px solid #33508d;font-size:12px}
    .btn{background:#1a356b;color:#e8f1ff;border:1px solid #3d67b5;border-radius:8px;padding:8px 12px;cursor:pointer;margin-right:8px}
  </style>
</head>
<body>
  <h1>Innovult Recruiting & Business Development Dashboard</h1>
  <div style='margin:8px 0 12px'>
    <button class='btn' onclick="window.open('file:///C:/Users/jtimb/Desktop/Refresh-InnovultDashboard.cmd','_self')">Refresh Dashboard</button>
    <button class='btn' onclick="window.open('https://www.linkedin.com/jobs/search/?keywords=ERP%20Project%20Manager%20Contract%20C2C&location=United%20States','_blank')">Refresh LinkedIn PM Jobs</button>
    <button class='btn' onclick="window.open('https://www.linkedin.com/jobs/search/?keywords=SAP%20FICO%20Consultant%20Contract&location=United%20States','_blank')">Refresh LinkedIn Functional Jobs</button>
    <button class='btn' onclick="window.open('https://www.google.com/search?sca_esv=bb692e0fdf80bd80&udm=8&q=ERP+functional+consultant+contract+United+States','_blank')">Refresh Google Jobs</button>
  </div>
  <div class='muted'>Generated: $generated • Review-only (no outreach sent) • US-based jobs only</div>

  <div class='card'><h2>Job Pipeline</h2>
    <table><tr><th>Job ID</th><th>Title</th><th>Company</th><th>Location</th><th>Rate Info</th><th>Contract Signal</th><th>Score</th><th>Source</th></tr>
    $jobRows
    </table>
  </div>

  <div class='card'><h2>Candidate Pipeline</h2>
    <table><tr><th>Candidate ID</th><th>Name</th><th>Current Title</th><th>Skills</th><th>Platform</th><th>Source</th></tr>
    $candidateRows
    </table>
  </div>
</body>
</html>
"@

Set-Content -Path $dashboardPath -Value $html -Encoding UTF8
Copy-Item $dashboardPath $desktopDashboardPath -Force
