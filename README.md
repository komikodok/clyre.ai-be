# Ringkasan Aplikasi Medical AI Assistant

## **Deskripsi Aplikasi**
Aplikasi backend chatbot kesehatan berbasis AI yang bertindak sebagai asisten medis virtual untuk membantu pengguna memahami gejala penyakit, mendapatkan saran awal, dan panduan langkah selanjutnya dalam penanganan kesehatan mereka.

## **Technology Stack**
- **Express.js**: Framework web untuk membangun RESTful API dan menangani routing
- **MongoDB + Mongoose**: Database NoSQL untuk menyimpan riwayat percakapan, profil pengguna, dan data medis
- **LangChain**: Framework untuk membangun aplikasi berbasis LLM dengan chain of thought reasoning
- **LangGraph**: Orchestration untuk workflow AI yang lebih kompleks dan state management
- **Jest**: Testing framework untuk unit dan integration testing

## **Fitur Utama**
1. **Symptom Checker**: Analisis gejala yang disampaikan pengguna
2. **Initial Assessment**: Memberikan penilaian awal berdasarkan gejala
3. **Health Recommendations**: Saran perawatan mandiri dan lifestyle
4. **Next Steps Guidance**: Rekomendasi apakah perlu konsultasi dokter, ke IGD, atau perawatan di rumah
5. **Conversation History**: Menyimpan riwayat percakapan untuk referensi
6. **Multi-turn Dialogue**: Kemampuan bertanya lebih detail untuk diagnosis yang lebih akurat

## **Arsitektur Sistem**
- **API Layer**: Express.js REST endpoints
- **AI Orchestration**: LangGraph untuk workflow management
- **LLM Integration**: LangChain untuk komunikasi dengan model AI
- **Data Persistence**: MongoDB untuk storage

## **Use Cases**
- Pengguna dengan gejala ringan mencari informasi awal
- Triase mandiri sebelum ke fasilitas kesehatan
- Edukasi kesehatan dan pencegahan penyakit
- Tracking gejala dari waktu ke waktu

## **Pertimbangan Penting**
⚠️ **Medical Disclaimer**: Aplikasi harus memiliki disclaimer jelas bahwa ini bukan pengganti konsultasi medis profesional dan hanya untuk informasi edukatif/saran awal.


