$headers = @{
  "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IjBBM2N4dUNBWjNvQnV3cFEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3N1bnZsZHl1dXhoanp4andmdGF2LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJkNGViOWYyMS01MTU1LTQyYzItOTA0OS0zMmJjNTU4NzMyYTYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ4OTY4NTYyLCJpYXQiOjE3NDg5NjQ5NjIsImVtYWlsIjoiYWRlcG9qdW9sdXdhcmludUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoiYWRlcG9qdW9sdXdhcmludUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6Ik9sdXdhcmludSBBZGVwb2p1IiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiJkNGViOWYyMS01MTU1LTQyYzItOTA0OS0zMmJjNTU4NzMyYTYifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc0ODk2MTQzOX1dLCJzZXNzaW9uX2lkIjoiMDU0N2E1OGItM2JjMS00NTI0LThhZmItOWQ2Yzc1MTFjNzM0IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.TUtiP1aNX7WHqWHWQGmNV8hhHFLvvM5lBXNe-_NfdaU"
  "Content-Type" = "application/json"
}

try {
  $response = Invoke-RestMethod -Uri "https://bdmwxjrwdejjunlisgsp.functions.supabase.co/attendance-aggregation" -Method Post -Headers $headers -Body (Get-Content -Raw -Path .\body.json)
  $response | ConvertTo-Json -Depth 10
} catch {
  Write-Host "StatusCode:" $_.Exception.Response.StatusCode.value__
  Write-Host "StatusDescription:" $_.Exception.Response.StatusDescription
  $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
  $body = $reader.ReadToEnd()
  Write-Host "Response body:`n$body"
} 