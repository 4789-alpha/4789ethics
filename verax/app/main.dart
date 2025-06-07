import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() => runApp(VeraxApp());

class VeraxApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(home: VeraxHome());
  }
}

class VeraxHome extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('VERAX – Limen')),
      body: Column(
        children: [
          Expanded(
            flex: 3,
            child: VeraxMapWidget(), // GPX-Karte direkt beim Start
          ),
          Expanded(
            flex: 2,
            child: Center(child: Text('Wähle deine Richtung, 4789.')),
          ),
        ],
      ),
    );
  }
}

class VeraxMapWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const WebView(
      initialUrl: '/verax/map/leaflet.html',
      javascriptMode: JavascriptMode.unrestricted,
    );
  }
}
