$body = @{
    message = "hello, how are you?"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/chat" -Method POST -ContentType "application/json" -Body $body

Write-Host "Success: $($response.success)"
Write-Host "Model Used: $($response.model_used)"
Write-Host "Response: $($response.response)"
