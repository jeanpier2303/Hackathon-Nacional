DROP TABLE IF EXISTS `analisis_ia`;

CREATE TABLE `analisis_ia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contrato_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `score_riesgo` int DEFAULT NULL,
  `dictamen_final` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `justificacion_dictamen` longtext COLLATE utf8mb4_unicode_ci,
  `resumen_ejecutivo` longtext COLLATE utf8mb4_unicode_ci,
  `perfil_riesgo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `evaluacion_precio` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `evaluacion_plazo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `evidencia_fraccionamiento` tinyint(1) DEFAULT NULL,
  `alerta_mismo_dia` tinyint(1) DEFAULT NULL,
  `sobrecosto_detectado` tinyint(1) DEFAULT NULL,
  `cumplimiento_transparencia` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cumplimiento_economia` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cumplimiento_responsabilidad` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `banderas_rojas` json DEFAULT NULL,
  `violaciones_ley` json DEFAULT NULL,
  `recomendaciones` json DEFAULT NULL,
  `analisis_financiero` json DEFAULT NULL,
  `analisis_contratista` json DEFAULT NULL,
  `analisis_transparencia` json DEFAULT NULL,
  `analisis_plazo` json DEFAULT NULL,
  `analisis_fraccionamiento` json DEFAULT NULL,
  `cumplimiento_legal` json DEFAULT NULL,
  `respuesta_completa` json DEFAULT NULL,
  `fecha_analisis` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_contrato` (`contrato_id`),
  CONSTRAINT `fk_contrato` FOREIGN KEY (`contrato_id`) REFERENCES `contratos` (`contrato_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `analisis_ia` WRITE;
INSERT INTO `analisis_ia` VALUES (1,'CD-DTAM NACION-CPS No. 001-2019',20,'APROBADO','El contrato cumple con requisitos legales.','Contrato con riesgo bajo.','BAJO-MEDIO','JUSTO','SOSPECHOSO',0,1,0,'CUMPLE PARCIAL','CUMPLE','CUMPLE','[\"Firma e inicio el mismo día\", \"Contratación directa\"]','[\"Art. 24 Ley 80/1993\"]','[\"Verificar hoja de vida\", \"Revisar estudio previo\"]','{\"valor_por_dia\": 174672, \"valor_total_cop\": 5240183, \"evaluacion_precio\": \"JUSTO\", \"sobrecosto_detectado\": false}','{\"perfil_riesgo\": \"BAJO-MEDIO\", \"nombre_completo\": \"LEIZA FERNANDA LANK MANRIQUE\"}','null','{\"alerta_mismo_dia\": true, \"evaluacion_plazo\": \"SOSPECHOSO\"}','{\"evidencia_fraccionamiento\": false}','{\"art_25_economia\": \"CUMPLE\", \"art_24_transparencia\": \"CUMPLE PARCIAL\", \"art_26_responsabilidad\": \"CUMPLE\"}','{\"score_riesgo\": 20, \"violacion_ley\": [\"Art. 24 Ley 80/1993\"], \"analisis_plazo\": {\"alerta_mismo_dia\": true, \"evaluacion_plazo\": \"SOSPECHOSO\"}, \"banderas_rojas\": [\"Firma e inicio el mismo día\", \"Contratación directa\"], \"dictamen_final\": \"APROBADO\", \"recomendaciones\": [\"Verificar hoja de vida\", \"Revisar estudio previo\"], \"resumen_ejecutivo\": \"Contrato con riesgo bajo.\", \"cumplimiento_legal\": {\"art_25_economia\": \"CUMPLE\", \"art_24_transparencia\": \"CUMPLE PARCIAL\", \"art_26_responsabilidad\": \"CUMPLE\"}, \"analisis_financiero\": {\"valor_por_dia\": 174672, \"valor_total_cop\": 5240183, \"evaluacion_precio\": \"JUSTO\", \"sobrecosto_detectado\": false}, \"analisis_contratista\": {\"perfil_riesgo\": \"BAJO-MEDIO\", \"nombre_completo\": \"LEIZA FERNANDA LANK MANRIQUE\"}, \"justificacion_dictamen\": \"El contrato cumple con requisitos legales.\", \"analisis_fraccionamiento\": {\"evidencia_fraccionamiento\": false}}','2026-05-07 03:41:58'),(2,'MC-ALCALDIA-CALI-045-2022',78,'RIESGO ALTO','Se detectaron múltiples alertas asociadas al proceso contractual.','Contrato con múltiples indicadores de riesgo y posible sobrecosto.','ALTO','POSIBLE SOBRECOSTO','MUY SOSPECHOSO',1,1,1,'NO CUMPLE','CUMPLE PARCIAL','NO CUMPLE','[\"Posible fraccionamiento\", \"Sobrecosto detectado\", \"Firma e inicio el mismo día\", \"Único oferente\"]','[\"Art. 24 Ley 80/1993\", \"Art. 25 Ley 80/1993\"]','[\"Revisar estudios previos\", \"Auditar cotizaciones\", \"Verificar pluralidad de oferentes\"]','{\"valor_por_dia\": 6166666, \"valor_total_cop\": 185000000, \"evaluacion_precio\": \"POSIBLE SOBRECOSTO\", \"sobrecosto_detectado\": true}','{\"perfil_riesgo\": \"ALTO\", \"nombre_completo\": \"TECNOLOGIAS DEL PACIFICO SAS\"}','null','{\"alerta_mismo_dia\": true, \"evaluacion_plazo\": \"MUY SOSPECHOSO\"}','{\"evidencia_fraccionamiento\": true}','{\"art_25_economia\": \"CUMPLE PARCIAL\", \"art_24_transparencia\": \"NO CUMPLE\", \"art_26_responsabilidad\": \"NO CUMPLE\"}','{\"score_riesgo\": 78, \"violacion_ley\": [\"Art. 24 Ley 80/1993\", \"Art. 25 Ley 80/1993\"], \"analisis_plazo\": {\"alerta_mismo_dia\": true, \"evaluacion_plazo\": \"MUY SOSPECHOSO\"}, \"banderas_rojas\": [\"Posible fraccionamiento\", \"Sobrecosto detectado\", \"Firma e inicio el mismo día\", \"Único oferente\"], \"dictamen_final\": \"RIESGO ALTO\", \"recomendaciones\": [\"Revisar estudios previos\", \"Auditar cotizaciones\", \"Verificar pluralidad de oferentes\"], \"resumen_ejecutivo\": \"Contrato con múltiples indicadores de riesgo y posible sobrecosto.\", \"cumplimiento_legal\": {\"art_25_economia\": \"CUMPLE PARCIAL\", \"art_24_transparencia\": \"NO CUMPLE\", \"art_26_responsabilidad\": \"NO CUMPLE\"}, \"analisis_financiero\": {\"valor_por_dia\": 6166666, \"valor_total_cop\": 185000000, \"evaluacion_precio\": \"POSIBLE SOBRECOSTO\", \"sobrecosto_detectado\": true}, \"analisis_contratista\": {\"perfil_riesgo\": \"ALTO\", \"nombre_completo\": \"TECNOLOGIAS DEL PACIFICO SAS\"}, \"justificacion_dictamen\": \"Se detectaron múltiples alertas asociadas al proceso contractual.\", \"analisis_fraccionamiento\": {\"evidencia_fraccionamiento\": true}}','2026-05-07 04:32:08');
UNLOCK TABLES;


DROP TABLE IF EXISTS `contratos`;

CREATE TABLE `contratos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contrato_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `proceso_compra` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entidad` text COLLATE utf8mb4_unicode_ci,
  `nit_entidad` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `departamento` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ciudad` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `proveedor` text COLLATE utf8mb4_unicode_ci,
  `documento_proveedor` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_contrato` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modalidad_contratacion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado_contrato` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion_proceso` longtext COLLATE utf8mb4_unicode_ci,
  `objeto_contrato` longtext COLLATE utf8mb4_unicode_ci,
  `valor_contrato` bigint DEFAULT NULL,
  `valor_pagado` bigint DEFAULT NULL,
  `valor_pendiente` bigint DEFAULT NULL,
  `fecha_firma` date DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `url_proceso` text COLLATE utf8mb4_unicode_ci,
  `datos_secop` json DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contrato_id` (`contrato_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1003 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `documentos_pdf`;

CREATE TABLE `documentos_pdf` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contrato_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombre_archivo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ruta_archivo` text COLLATE utf8mb4_unicode_ci,
  `tamano_archivo` bigint DEFAULT NULL,
  `texto_extraido` longtext COLLATE utf8mb4_unicode_ci,
  `fecha_subida` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_pdf_contrato` (`contrato_id`),
  CONSTRAINT `fk_pdf_contrato` FOREIGN KEY (`contrato_id`) REFERENCES `contratos` (`contrato_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `documentos_pdf` WRITE;

UNLOCK TABLES;

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_hash` text COLLATE utf8mb4_unicode_ci,
  `rol` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'analista',
  `activo` tinyint(1) DEFAULT '1',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `usuarios` WRITE;

UNLOCK TABLES;


/* Chat Sesiones nuevas */
CREATE TABLE chat_sesiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NULL,
    titulo VARCHAR(255),
    resumen_contexto LONGTEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE chat_mensajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sesion_id INT NOT NULL,
    role ENUM('system','user','assistant'),
    contenido LONGTEXT,
    contrato_id VARCHAR(255) NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (sesion_id)
    REFERENCES chat_sesiones(id)
    ON DELETE CASCADE
);