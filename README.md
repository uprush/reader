Reader
======

Read documents and extract important keywords in real-time.

# Technologies
- TFIDF
- AWS Services
  - S3 notification
  - Lambda
  - DynamoDB

# Workflow
- Send text document to S3
- S3 notification triggers Lambda function called Reader
- Reader gets text from S3, calculate TF
- Reader gets IDF from DynamoDB
- Reader updates DynamoDB with new IDF
- Reader extract important keywords using TFIDF
