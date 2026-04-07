guardar: async function(datos) {
    const editId = document.getElementById('editId').value;
    const ahora = new Date().toISOString();
    const usuarioActual = window.getUsuarioActual();
    const nombreUsuario = usuarioActual ? usuarioActual.username : 'Sistema';
    
    // ==================================================
    // 🔥 FORZAR CREACIÓN DE ID SI NO EXISTE
    // ==================================================
    let idGenerado = null;
    if (editId) {
        idGenerado = editId;
    } else {
        idGenerado = Utils.generarIdUnico();
    }
    
    console.log('🆔 ID a guardar:', idGenerado);
    
    const registroData = {
        id: idGenerado,
        po: datos.po,
        proceso: datos.proceso,
        es_reemplazo: datos.es_reemplazo || false,
        semana: datos.semana,
        fecha: datos.fecha,
        estilo: datos.estilo,
        tela: datos.tela || '',
        colores: datos.colores || [],
        numero_plotter: datos.numero_plotter || 0,
        plotter_temp: datos.plotter_temp || 0,
        plotter_humedad: datos.plotter_humedad || 0,
        plotter_perfil: datos.plotter_perfil || '',
        monti_numero: datos.monti_numero || 0,
        temperatura_monti: datos.temperatura_monti || 0,
        velocidad_monti: datos.velocidad_monti || 0,
        monti_presion: datos.monti_presion || 0,
        temperatura_flat: datos.temperatura_flat || 0,
        tiempo_flat: datos.tiempo_flat || 0,
        adhesivo: datos.adhesivo || '',
        version: 1,
        observacion: datos.observacion || null,
        usuarioModifico: nombreUsuario,
        creado: editId ? null : ahora,
        actualizado: ahora
    };
    
    // Intentar guardar en Supabase
    if (window.SupabaseClient && window.SupabaseClient.client) {
        try {
            const { error } = await window.SupabaseClient.client
                .from('registros')
                .upsert(registroData);
            
            if (error) {
                console.error('❌ Error de Supabase:', error);
                Notifications.error('Error en la nube: ' + (error.message || error.details));
                return false;
            }
            
            console.log('✅ Guardado en Supabase con ID:', idGenerado);
            
            // Actualizar AppState
            if (editId) {
                AppState.updateRegistro(editId, registroData);
            } else {
                AppState.addRegistro(registroData);
            }
            
            Notifications.success('✅ Registro guardado en la nube');
            return true;
            
        } catch (error) {
            console.error('❌ Excepción:', error);
            Notifications.error('Error de conexión: ' + error.message);
            return false;
        }
    } else {
        Notifications.error('❌ Supabase no disponible');
        return false;
    }
}
